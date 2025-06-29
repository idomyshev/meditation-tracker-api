import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from '../entities/record.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordsRepository: Repository<Record>,
  ) {}

  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    const record = this.recordsRepository.create(createRecordDto);
    return await this.recordsRepository.save(record);
  }

  async findAll(): Promise<Record[]> {
    return await this.recordsRepository.find({
      where: { deleted: false },
      relations: ['user', 'meditation'],
    });
  }

  async findOne(id: string): Promise<Record | null> {
    return await this.recordsRepository.findOne({
      where: { id, deleted: false },
      relations: ['user', 'meditation'],
    });
  }

  async findByUser(userId: string): Promise<Record[]> {
    return await this.recordsRepository.find({
      where: { userId, deleted: false },
      relations: ['user', 'meditation'],
    });
  }

  async findByMeditation(meditationId: string): Promise<Record[]> {
    return await this.recordsRepository.find({
      where: { meditationId, deleted: false },
      relations: ['user', 'meditation'],
    });
  }

  async update(id: string, updateRecordDto: UpdateRecordDto): Promise<Record | null> {
    await this.recordsRepository.update(id, updateRecordDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.recordsRepository.update(id, { deleted: true });
  }
} 