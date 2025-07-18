import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities';

export interface UserPayload {
  username: string;
  sub: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
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
  ) { }

  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    let user: User | null = null;

    // Пробуем найти пользователя по email
    if (usernameOrEmail.includes('@')) {
      user = await this.usersService.findByEmail(usernameOrEmail);
    }

    // Если пользователь не найден по email, ищем по username
    if (!user) {
      user = await this.usersService.findByUsername(usernameOrEmail);
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: {
    id: string;
    username: string;
    email: string;
    name: string;
    surname: string;
  }): LoginResponse {
    const payload: UserPayload = {
      username: user.username,
      sub: user.id,
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
      const payload = this.jwtService.verify<UserPayload>(refreshToken);
      const user = await this.usersService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload: UserPayload = {
        username: user.username,
        sub: user.id,
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
