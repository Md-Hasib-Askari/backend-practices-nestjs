import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { email, password, roles } = createUserDto;
    return this.authService.register(email, password, roles);
  }

  @Post('login')
  async login(@Body() LoginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { email, password } = LoginDto;
    const result = await this.authService.login(email, password);
    if (!result) {
      return { message: 'Invalid credentials', res: result };
    }

    const { access_token } = result;
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Login successful', res: result };
  }
}
