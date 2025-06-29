import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MeditationsService } from './meditations.service';
import { CreateMeditationDto } from './dto/create-meditation.dto';
import { UpdateMeditationDto } from './dto/update-meditation.dto';

@ApiTags('meditations')
@Controller('meditations')
export class MeditationsController {
  constructor(private readonly meditationsService: MeditationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new meditation session' })
  @ApiResponse({ status: 201, description: 'Meditation successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createMeditationDto: CreateMeditationDto) {
    return this.meditationsService.create(createMeditationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all meditation sessions' })
  @ApiResponse({ status: 200, description: 'List of all meditation sessions' })
  findAll() {
    return this.meditationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meditation session by ID' })
  @ApiParam({ name: 'id', description: 'Meditation ID' })
  @ApiResponse({ status: 200, description: 'Meditation found' })
  @ApiResponse({ status: 404, description: 'Meditation not found' })
  findOne(@Param('id') id: string) {
    return this.meditationsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get meditation sessions by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of user meditation sessions' })
  findByUser(@Param('userId') userId: string) {
    return this.meditationsService.findByUser(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update meditation session by ID' })
  @ApiParam({ name: 'id', description: 'Meditation ID' })
  @ApiResponse({ status: 200, description: 'Meditation successfully updated' })
  @ApiResponse({ status: 404, description: 'Meditation not found' })
  update(@Param('id') id: string, @Body() updateMeditationDto: UpdateMeditationDto) {
    return this.meditationsService.update(id, updateMeditationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete meditation session by ID' })
  @ApiParam({ name: 'id', description: 'Meditation ID' })
  @ApiResponse({ status: 204, description: 'Meditation successfully deleted' })
  @ApiResponse({ status: 404, description: 'Meditation not found' })
  remove(@Param('id') id: string) {
    return this.meditationsService.remove(id);
  }
} 