import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const byEmail = !!loginDto.email;
    const usernameOrEmail = byEmail ? loginDto.email : loginDto.username;

    if (!usernameOrEmail) {
      throw new UnauthorizedException(
        'Either username or email must be provided',
      );
    }

    const user = await this.authService.validateUser(
      byEmail,
      usernameOrEmail,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
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
    if (!req.user?.userId) {
      throw new NotFoundException('User not found');
    }

    const user = await this.usersService.findOne(req.user.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;

    return result;
  }
}
