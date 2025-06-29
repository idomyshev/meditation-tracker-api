import { Injectable, ConflictException } from '@nestjs/common';
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
    // Check if meditation with this name already exists for this user
    const existingMeditation = await this.meditationsRepository.findOne({
      where: { 
        name: createMeditationDto.name,
        userId: createMeditationDto.userId,
      },
    });

    if (existingMeditation) {
      throw new ConflictException(
        `Meditation with name '${createMeditationDto.name}' already exists for this user`
      );
    }

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
    // If name is being updated, check for duplicates for the same user
    if (updateMeditationDto.name) {
      const currentMeditation = await this.findOne(id);
      if (currentMeditation) {
        const existingMeditation = await this.meditationsRepository.findOne({
          where: { 
            name: updateMeditationDto.name,
            userId: currentMeditation.userId,
            id: { $ne: id } as any,
          },
        });

        if (existingMeditation) {
          throw new ConflictException(
            `Meditation with name '${updateMeditationDto.name}' already exists for this user`
          );
        }
      }
    }

    await this.meditationsRepository.update(id, updateMeditationDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.meditationsRepository.delete(id);
  }
} 