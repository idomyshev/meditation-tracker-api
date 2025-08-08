import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Meditation } from '../entities/meditation.entity';
import { User } from '../entities/user.entity';
import { CreateMeditationDto } from './dto/create-meditation.dto';
import { UpdateMeditationDto } from './dto/update-meditation.dto';

@Injectable()
export class MeditationsService {
  constructor(
    @InjectRepository(Meditation)
    private meditationsRepository: Repository<Meditation>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createMeditationDto: CreateMeditationDto): Promise<Meditation> {
    // Check if user exists
    const user = await this.usersRepository.findOne({
      where: { id: createMeditationDto.userId, active: true },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID '${createMeditationDto.userId}' not found`,
      );
    }

    // Check if meditation with this name already exists for this user
    const existingMeditation = await this.meditationsRepository.findOne({
      where: {
        name: createMeditationDto.name,
        userId: createMeditationDto.userId,
      },
    });

    if (existingMeditation) {
      throw new ConflictException(
        `Meditation with name '${createMeditationDto.name}' already exists for this user`,
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

  async update(
    id: string,
    updateMeditationDto: UpdateMeditationDto,
  ): Promise<Meditation | null> {
    // Check if meditation exists
    const currentMeditation = await this.findOne(id);
    if (!currentMeditation) {
      throw new NotFoundException(`Meditation with ID '${id}' not found`);
    }

    // If name is being updated, check for duplicates for the same user
    if (updateMeditationDto.name) {
      const existingMeditation = await this.meditationsRepository.findOne({
        where: {
          name: updateMeditationDto.name,
          userId: currentMeditation.userId,
          id: Not(id),
        },
      });

      if (existingMeditation) {
        throw new ConflictException(
          `Meditation with name '${updateMeditationDto.name}' already exists for this user`,
        );
      }
    }

    await this.meditationsRepository.update(id, updateMeditationDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.meditationsRepository.delete(id);
  }
}
