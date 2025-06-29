import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { DuplicateEntityException } from '../exceptions/duplicate-entity.exception';

interface PostgresError extends Error {
  code: string;
  detail: string;
}

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Check if it's a duplicate key error (PostgreSQL error code 23505)
    const driverError = exception.driverError as PostgresError;
    if (driverError?.code === '23505') {
      const detail = driverError.detail;
      
      // Extract field name and value from the error detail
      const match = detail.match(/Key \(([^)]+)\)=\(([^)]+)\) already exists\./);
      
      if (match) {
        const fieldName = match[1];
        const fieldValue = match[2];
        
        // Determine entity name based on the field
        let entityName = 'Entity';
        if (fieldName === 'username') {
          entityName = 'User';
        } else if (fieldName === 'name' && exception.query.includes('meditations')) {
          entityName = 'Meditation';
        }
        
        const duplicateException = new DuplicateEntityException(entityName, fieldName, fieldValue);
        
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: duplicateException.message,
          error: 'Conflict',
        });
      }
    }

    // For other TypeORM errors, return a generic error
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database operation failed',
      error: 'Internal Server Error',
    });
  }
} 