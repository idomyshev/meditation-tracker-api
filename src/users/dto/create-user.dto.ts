import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique username for the user',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  surname: string;

  @ApiProperty({
    description: 'User password (will be hashed)',
    example: 'securepassword123',
  })
  password: string;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
    required: false,
    default: true,
  })
  active?: boolean;
}
