import { ApiProperty } from '@nestjs/swagger';

export class CreateMeditationDto {
  @ApiProperty({
    description: 'ID of the user who owns this meditation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Name of the meditation session',
    example: 'Morning Mindfulness',
  })
  name: string;
} 