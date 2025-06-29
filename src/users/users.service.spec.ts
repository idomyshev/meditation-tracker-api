import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    Object.values(mockRepository).forEach(fn => fn.mockReset && fn.mockReset());
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        name: 'Test',
        surname: 'User',
        password: 'password123',
      };

      const user = { id: '1', ...createUserDto, active: true, createdAt: new Date(), updatedAt: new Date() };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);

      expect(result).toEqual(user);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username: createUserDto.username },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw ConflictException when username already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existinguser',
        name: 'Test',
        surname: 'User',
        password: 'password123',
      };

      const existingUser = { id: '1', ...createUserDto, active: true, createdAt: new Date(), updatedAt: new Date() };

      mockRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException(`User with username '${createUserDto.username}' already exists`)
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username: createUserDto.username },
      });
    });
  });

  describe('findAll', () => {
    it('should return all active users', async () => {
      const users = [
        { id: '1', username: 'user1', name: 'User', surname: 'One', password: 'pass1', active: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', username: 'user2', name: 'User', surname: 'Two', password: 'pass2', active: true, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { active: true },
        relations: ['meditations', 'records'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', username: 'user1', name: 'User', surname: 'One', password: 'pass1', active: true, createdAt: new Date(), updatedAt: new Date() };

      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', active: true },
        relations: ['meditations', 'records'],
      });
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const updatedUser = { id: '1', username: 'user1', name: 'Updated Name', surname: 'One', password: 'pass1', active: true, createdAt: new Date(), updatedAt: new Date() };

      mockRepository.findOne.mockReset();
      mockRepository.findOne
        .mockResolvedValueOnce(null) // Проверка на дубликат username
        .mockImplementationOnce(() => updatedUser); // Возврат обновлённого пользователя
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update('1', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.update).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should throw ConflictException when updating to existing username', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'existinguser',
      };

      const existingUser = { id: '2', username: 'existinguser', name: 'User', surname: 'Two', password: 'pass2', active: true, createdAt: new Date(), updatedAt: new Date() };

      mockRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        new ConflictException(`User with username '${updateUserDto.username}' already exists`)
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username: updateUserDto.username, id: { $ne: '1' } as any },
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });

      await service.remove('1');

      expect(mockRepository.update).toHaveBeenCalledWith('1', { active: false });
    });
  });
}); 