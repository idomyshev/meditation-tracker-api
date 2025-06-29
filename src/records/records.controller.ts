import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@ApiTags('records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new meditation record' })
  @ApiResponse({ status: 201, description: 'Record successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createRecordDto: CreateRecordDto) {
    return this.recordsService.create(createRecordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all meditation records (not deleted)' })
  @ApiResponse({ status: 200, description: 'List of all meditation records' })
  findAll() {
    return this.recordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meditation record by ID' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiResponse({ status: 200, description: 'Record found' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get meditation records by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of user meditation records' })
  findByUser(@Param('userId') userId: string) {
    return this.recordsService.findByUser(userId);
  }

  @Get('meditation/:meditationId')
  @ApiOperation({ summary: 'Get meditation records by meditation session ID' })
  @ApiParam({ name: 'meditationId', description: 'Meditation session ID' })
  @ApiResponse({ status: 200, description: 'List of meditation session records' })
  findByMeditation(@Param('meditationId') meditationId: string) {
    return this.recordsService.findByMeditation(meditationId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update meditation record by ID' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiResponse({ status: 200, description: 'Record successfully updated' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordsService.update(id, updateRecordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete meditation record by ID (soft delete)' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiResponse({ status: 204, description: 'Record successfully deleted' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  remove(@Param('id') id: string) {
    return this.recordsService.remove(id);
  }
} 