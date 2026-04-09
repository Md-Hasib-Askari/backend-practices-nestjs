import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@ApiHeader({ name: 'x-tenant-id', required: true })
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.authService.register(dto, tenantId);
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const tenantId = (req as any).tenantId as string;
        const { access_token } = await this.authService.login(dto, tenantId);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            sameSite: 'lax',
        });

        return { message: 'Logged in successfully' };
    }
}
