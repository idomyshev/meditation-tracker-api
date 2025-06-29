import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meditation } from '../entities/meditation.entity';
import { CreateMeditationDto } from './dto/create-meditation.dto';
import { UpdateMeditationDto } from './dto/update-meditation.dto';

@Injectable()
export class MeditationsService {
  constructor(
    @InjectRepository(Meditation)
    private meditationsRepository: Repository<Meditation>,
  ) {}

  async create(createMeditationDto: CreateMeditationDto): Promise<Meditation> {
    const meditation = this.meditationsRepository.create(createMeditationDto);
    return await this.meditationsRepository.save(meditation);
  }

  async findAll(): Promise<Meditation[]> {
    return await this.meditationsRepository.find({
      relations: ['user', 'records'],
    });
  }

  async findOne(id: string): Promise<Meditation | null> {
    return await this.meditationsRepository.findOne({
      where: { id },
      relations: ['user', 'records'],
    });
  }

  async findByUser(userId: string): Promise<Meditation[]> {
    return await this.meditationsRepository.find({
      where: { userId },
      relations: ['user', 'records'],
    });
  }

  async update(id: string, updateMeditationDto: UpdateMeditationDto): Promise<Meditation | null> {
    await this.meditationsRepository.update(id, updateMeditationDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.meditationsRepository.delete(id);
  }
} 