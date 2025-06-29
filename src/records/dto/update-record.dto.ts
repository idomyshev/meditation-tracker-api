import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecordDto {
  @ApiProperty({
    description: 'Duration of meditation in minutes',
    example: 20.0,
    type: 'number',
    required: false,
  })
  value?: number;

  @ApiProperty({
    description: 'Whether the record is deleted (soft delete)',
    example: false,
    required: false,
  })
  deleted?: boolean;
} 