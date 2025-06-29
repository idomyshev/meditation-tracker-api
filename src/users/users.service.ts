import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with this username already exists
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException(`User with username '${createUserDto.username}' already exists`);
    }

    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      where: { active: true },
      relations: ['meditations', 'records'],
    });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id, active: true },
      relations: ['meditations', 'records'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    // If username is being updated, check for duplicates
    if (updateUserDto.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username: updateUserDto.username, id: { $ne: id } as any },
      });

      if (existingUser) {
        throw new ConflictException(`User with username '${updateUserDto.username}' already exists`);
      }
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.update(id, { active: false });
  }
} 