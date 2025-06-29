import { Test, TestingModule } from '@nestjs/testing';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

describe('RecordsController', () => {
  let controller: RecordsController;
  let service: RecordsService;

  const mockRecordsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUser: jest.fn(),
    findByMeditation: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRecord = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    meditationId: '123e4567-e89b-12d3-a456-426614174002',
    value: 15.5,
    deleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordsController],
      providers: [
        {
          provide: RecordsService,
          useValue: mockRecordsService,
        },
      ],
    }).compile();

    controller = module.get<RecordsController>(RecordsController);
    service = module.get<RecordsService>(RecordsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const createRecordDto: CreateRecordDto = {
        userId: '123e4567-e89b-12d3-a456-426614174001',
        meditationId: '123e4567-e89b-12d3-a456-426614174002',
        value: 15.5,
      };

      mockRecordsService.create.mockResolvedValue(mockRecord);

      const result = await controller.create(createRecordDto);

      expect(service.create).toHaveBeenCalledWith(createRecordDto);
      expect(result).toEqual(mockRecord);
    });
  });

  describe('findAll', () => {
    it('should return an array of records', async () => {
      const records = [mockRecord];
      mockRecordsService.findAll.mockResolvedValue(records);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(records);
    });
  });

  describe('findOne', () => {
    it('should return a single record', async () => {
      const recordId = '123e4567-e89b-12d3-a456-426614174000';
      mockRecordsService.findOne.mockResolvedValue(mockRecord);

      const result = await controller.findOne(recordId);

      expect(service.findOne).toHaveBeenCalledWith(recordId);
      expect(result).toEqual(mockRecord);
    });
  });

  describe('findByUser', () => {
    it('should return records for a specific user', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const records = [mockRecord];
      mockRecordsService.findByUser.mockResolvedValue(records);

      const result = await controller.findByUser(userId);

      expect(service.findByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(records);
    });
  });

  describe('findByMeditation', () => {
    it('should return records for a specific meditation', async () => {
      const meditationId = '123e4567-e89b-12d3-a456-426614174002';
      const records = [mockRecord];
      mockRecordsService.findByMeditation.mockResolvedValue(records);

      const result = await controller.findByMeditation(meditationId);

      expect(service.findByMeditation).toHaveBeenCalledWith(meditationId);
      expect(result).toEqual(records);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const recordId = '123e4567-e89b-12d3-a456-426614174000';
      const updateRecordDto: UpdateRecordDto = {
        value: 20.0,
      };

      const updatedRecord = { ...mockRecord, ...updateRecordDto };
      mockRecordsService.update.mockResolvedValue(updatedRecord);

      const result = await controller.update(recordId, updateRecordDto);

      expect(service.update).toHaveBeenCalledWith(recordId, updateRecordDto);
      expect(result).toEqual(updatedRecord);
    });
  });

  describe('remove', () => {
    it('should remove a record', async () => {
      const recordId = '123e4567-e89b-12d3-a456-426614174000';
      mockRecordsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(recordId);

      expect(service.remove).toHaveBeenCalledWith(recordId);
      expect(result).toBeUndefined();
    });
  });
}); 