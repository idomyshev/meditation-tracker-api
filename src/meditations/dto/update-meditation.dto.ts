import { ApiProperty } from '@nestjs/swagger';

export class UpdateMeditationDto {
  @ApiProperty({
    description: 'Name of the meditation session',
    example: 'Evening Mindfulness',
    required: false,
  })
  name?: string;
} 