import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Unique username for the user',
    example: 'john_doe',
    required: false,
  })
  username?: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  surname?: string;

  @ApiProperty({
    description: 'User password (will be hashed)',
    example: 'securepassword123',
    required: false,
  })
  password?: string;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
    required: false,
  })
  active?: boolean;
} 