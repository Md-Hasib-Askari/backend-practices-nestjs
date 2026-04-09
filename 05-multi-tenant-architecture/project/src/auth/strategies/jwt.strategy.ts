import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    permissions: string[];
    tenantId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (req) => req?.cookies?.access_token ?? null,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') ?? 'default_secret',
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        return payload;
    }
}
