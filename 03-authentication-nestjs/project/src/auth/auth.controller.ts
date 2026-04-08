import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

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
}
