import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'securepassword123',
  })
  password: string;
}
