import { ApiProperty } from '@nestjs/swagger';

export class CreateRecordDto {
  @ApiProperty({
    description: 'ID of the user who created this record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'ID of the meditation session',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  meditationId: string;

  @ApiProperty({
    description: 'Duration of meditation in minutes',
    example: 15.5,
    type: 'number',
  })
  value: number;
} 