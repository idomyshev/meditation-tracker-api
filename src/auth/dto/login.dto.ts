import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication (required if email not provided)',
    example: 'john_doe',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Email for authentication (required if username not provided)',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'securepassword123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
