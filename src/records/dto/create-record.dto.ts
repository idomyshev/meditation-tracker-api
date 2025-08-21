import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateRecordDto {
  @ApiProperty({
    description: 'ID of the meditation session',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  meditationId: string;

  @ApiProperty({
    description: 'Number of repetitions made during meditation session',
    example: 108,
    type: 'number',
  })
  @IsNumber()
  value: number;
}
