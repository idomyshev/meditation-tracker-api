import { ConflictException } from '@nestjs/common';

export class DuplicateEntityException extends ConflictException {
  constructor(entityName: string, fieldName: string, fieldValue: string) {
    super(`${entityName} with ${fieldName} '${fieldValue}' already exists`);
  }
}
