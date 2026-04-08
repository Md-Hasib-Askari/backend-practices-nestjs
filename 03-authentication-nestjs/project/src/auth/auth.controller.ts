import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiParam } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @ApiCreatedResponse({ type: RegisterResponseDto })
  async register(@Body() registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const user = await this.authService.register(email, password);
    const plainUser = typeof user.toObject === 'function' ? user.toObject() : user;

    return plainToInstance(RegisterResponseDto, plainUser, {
      excludeExtraneousValues: true,
    });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(loginDto);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
    return { message: 'Login successful' };
  }
}
