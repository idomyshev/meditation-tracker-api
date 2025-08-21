import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../users/types';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordsService } from './records.service';

@ApiTags('records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new meditation record' })
  @ApiResponse({ status: 201, description: 'Record successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createRecordDto: CreateRecordDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.recordsService.create(createRecordDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all meditation records (not deleted)' })
  @ApiResponse({ status: 200, description: 'List of all meditation records' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.recordsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get meditation record by ID' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiResponse({ status: 200, description: 'Record found' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get meditation records by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of user meditation records' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByUser(@Param('userId') userId: string) {
    return this.recordsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('meditation/:meditationId')
  @ApiOperation({ summary: 'Get meditation records by meditation session ID' })
  @ApiParam({ name: 'meditationId', description: 'Meditation session ID' })
  @ApiResponse({
    status: 200,
    description: 'List of meditation session records',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByMeditation(@Param('meditationId') meditationId: string) {
    return this.recordsService.findByMeditation(meditationId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update meditation record by ID' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiResponse({ status: 200, description: 'Record successfully updated' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordsService.update(id, updateRecordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete meditation record by ID (soft delete)' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiResponse({ status: 204, description: 'Record successfully deleted' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.recordsService.remove(id);
  }
}
