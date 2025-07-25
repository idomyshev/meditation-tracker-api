import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    console.log('Login attempt with:', loginDto);
    const byEmail = !!loginDto.email;
    const usernameOrEmail = byEmail ? loginDto.email : loginDto.username;

    if (!usernameOrEmail) {
      throw new UnauthorizedException(
        'Either username or email must be provided',
      );
    }

    const user = await this.authService.validateUser(
      usernameOrEmail,
      !!loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('Validated user:', user);
    const result = await this.authService.login(user);
    console.log('Login result:', result);
    return result;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshToken(refreshDto.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(
    @Request() req: { user: { userId: string; username: string } },
  ) {
    console.log('User from token:', req.user);

    if (!req.user?.userId) {
      throw new NotFoundException('User not found');
    }
    const user = await this.usersService.findOne(req.user.userId);
    console.log('User from database:', user);
    const result = { ...user };
    delete result.password;
    return result;
  }
}
