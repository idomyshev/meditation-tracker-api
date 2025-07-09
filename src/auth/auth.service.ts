import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

export interface UserPayload {
  username: string;
  sub: number;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    username: string;
    name: string;
    surname: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: {
    id: number;
    username: string;
    name: string;
    surname: string;
  }): LoginResponse {
    const payload: UserPayload = {
      username: user.username,
      sub: Number(user.id),
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        surname: user.surname,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload: UserPayload = {
        username: user.username,
        sub: Number(user.id),
      };

      return {
        access_token: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
        refresh_token: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          surname: user.surname,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
