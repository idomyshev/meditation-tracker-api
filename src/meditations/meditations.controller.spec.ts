import { Test, TestingModule } from '@nestjs/testing';
import { MeditationsController } from './meditations.controller';
import { MeditationsService } from './meditations.service';
import { CreateMeditationDto } from './dto/create-meditation.dto';
import { UpdateMeditationDto } from './dto/update-meditation.dto';

describe('MeditationsController', () => {
  let controller: MeditationsController;
  let service: MeditationsService;

  const mockMeditationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUser: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockMeditation = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Morning Meditation',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeditationsController],
      providers: [
        {
          provide: MeditationsService,
          useValue: mockMeditationsService,
        },
      ],
    }).compile();

    controller = module.get<MeditationsController>(MeditationsController);
    service = module.get<MeditationsService>(MeditationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new meditation', async () => {
      const createMeditationDto: CreateMeditationDto = {
        userId: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Morning Meditation',
      };

      mockMeditationsService.create.mockResolvedValue(mockMeditation);

      const result = await controller.create(createMeditationDto);

      expect(service.create).toHaveBeenCalledWith(createMeditationDto);
      expect(result).toEqual(mockMeditation);
    });
  });

  describe('findAll', () => {
    it('should return an array of meditations', async () => {
      const meditations = [mockMeditation];
      mockMeditationsService.findAll.mockResolvedValue(meditations);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(meditations);
    });
  });

  describe('findOne', () => {
    it('should return a single meditation', async () => {
      const meditationId = '123e4567-e89b-12d3-a456-426614174000';
      mockMeditationsService.findOne.mockResolvedValue(mockMeditation);

      const result = await controller.findOne(meditationId);

      expect(service.findOne).toHaveBeenCalledWith(meditationId);
      expect(result).toEqual(mockMeditation);
    });
  });

  describe('findByUser', () => {
    it('should return meditations for a specific user', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const meditations = [mockMeditation];
      mockMeditationsService.findByUser.mockResolvedValue(meditations);

      const result = await controller.findByUser(userId);

      expect(service.findByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(meditations);
    });
  });

  describe('update', () => {
    it('should update a meditation', async () => {
      const meditationId = '123e4567-e89b-12d3-a456-426614174000';
      const updateMeditationDto: UpdateMeditationDto = {
        name: 'Updated Meditation Name',
      };

      const updatedMeditation = { ...mockMeditation, ...updateMeditationDto };
      mockMeditationsService.update.mockResolvedValue(updatedMeditation);

      const result = await controller.update(meditationId, updateMeditationDto);

      expect(service.update).toHaveBeenCalledWith(meditationId, updateMeditationDto);
      expect(result).toEqual(updatedMeditation);
    });
  });

  describe('remove', () => {
    it('should remove a meditation', async () => {
      const meditationId = '123e4567-e89b-12d3-a456-426614174000';
      mockMeditationsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(meditationId);

      expect(service.remove).toHaveBeenCalledWith(meditationId);
      expect(result).toBeUndefined();
    });
  });
}); 