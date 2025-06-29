import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { MeditationsService } from './meditations.service';
import { Meditation } from '../entities/meditation.entity';
import { CreateMeditationDto } from './dto/create-meditation.dto';
import { UpdateMeditationDto } from './dto/update-meditation.dto';

describe('MeditationsService', () => {
  let service: MeditationsService;
  let repository: Repository<Meditation>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeditationsService,
        {
          provide: getRepositoryToken(Meditation),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MeditationsService>(MeditationsService);
    repository = module.get<Repository<Meditation>>(getRepositoryToken(Meditation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a meditation successfully', async () => {
      const createMeditationDto: CreateMeditationDto = {
        name: 'Morning Meditation',
        userId: 'user-123',
      };

      const meditation = { id: '1', ...createMeditationDto, createdAt: new Date(), updatedAt: new Date() };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(meditation);
      mockRepository.save.mockResolvedValue(meditation);

      const result = await service.create(createMeditationDto);

      expect(result).toEqual(meditation);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { 
          name: createMeditationDto.name,
          userId: createMeditationDto.userId,
        },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createMeditationDto);
      expect(mockRepository.save).toHaveBeenCalledWith(meditation);
    });

    it('should throw ConflictException when meditation name already exists for the same user', async () => {
      const createMeditationDto: CreateMeditationDto = {
        name: 'Morning Meditation',
        userId: 'user-123',
      };

      const existingMeditation = { id: '1', ...createMeditationDto, createdAt: new Date(), updatedAt: new Date() };

      mockRepository.findOne.mockResolvedValue(existingMeditation);

      await expect(service.create(createMeditationDto)).rejects.toThrow(
        new ConflictException(
          `Meditation with name '${createMeditationDto.name}' already exists for this user`
        )
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { 
          name: createMeditationDto.name,
          userId: createMeditationDto.userId,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all meditations', async () => {
      const meditations = [
        { id: '1', name: 'Morning Meditation', userId: 'user-1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Evening Meditation', userId: 'user-2', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockRepository.find.mockResolvedValue(meditations);

      const result = await service.findAll();

      expect(result).toEqual(meditations);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'records'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a meditation by id', async () => {
      const meditation = { id: '1', name: 'Morning Meditation', userId: 'user-1', createdAt: new Date(), updatedAt: new Date() };

      mockRepository.findOne.mockResolvedValue(meditation);

      const result = await service.findOne('1');

      expect(result).toEqual(meditation);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['user', 'records'],
      });
    });
  });

  describe('findByUser', () => {
    it('should return meditations by user id', async () => {
      const meditations = [
        { id: '1', name: 'Morning Meditation', userId: 'user-1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Evening Meditation', userId: 'user-1', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockRepository.find.mockResolvedValue(meditations);

      const result = await service.findByUser('user-1');

      expect(result).toEqual(meditations);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        relations: ['user', 'records'],
      });
    });
  });

  describe('update', () => {
    it('should update a meditation successfully', async () => {
      const updateMeditationDto: UpdateMeditationDto = {
        name: 'Updated Meditation',
      };

      const currentMeditation = { id: '1', name: 'Old Name', userId: 'user-1', createdAt: new Date(), updatedAt: new Date() };
      const updatedMeditation = { id: '1', name: 'Updated Meditation', userId: 'user-1', createdAt: new Date(), updatedAt: new Date() };

      mockRepository.findOne
        .mockResolvedValueOnce(currentMeditation) // First call in update method
        .mockResolvedValueOnce(null) // Second call for duplicate check
        .mockResolvedValueOnce(updatedMeditation); // Third call in findOne method
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update('1', updateMeditationDto);

      expect(result).toEqual(updatedMeditation);
      expect(mockRepository.update).toHaveBeenCalledWith('1', updateMeditationDto);
    });

    it('should throw ConflictException when updating to existing meditation name for the same user', async () => {
      const updateMeditationDto: UpdateMeditationDto = {
        name: 'Existing Meditation',
      };

      const currentMeditation = { id: '1', name: 'Old Name', userId: 'user-1', createdAt: new Date(), updatedAt: new Date() };
      const existingMeditation = { id: '2', name: 'Existing Meditation', userId: 'user-1', createdAt: new Date(), updatedAt: new Date() };

      mockRepository.findOne
        .mockResolvedValueOnce(currentMeditation) // First call in update method
        .mockResolvedValueOnce(existingMeditation); // Second call for duplicate check

      await expect(service.update('1', updateMeditationDto)).rejects.toThrow(
        new ConflictException(
          `Meditation with name '${updateMeditationDto.name}' already exists for this user`
        )
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { 
          name: updateMeditationDto.name,
          userId: currentMeditation.userId,
          id: { $ne: '1' } as any,
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete a meditation', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
  });
}); 