import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtPayloadDto } from "../auth/dto/jwt-payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(cfg: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    let token = null;
                    if (req && req.cookies) {
                        token = req.cookies['access_token'];
                    }
                    return token;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: cfg.get<string>('JWT_SECRET') ?? 'your_jwt_secret',
        });
    }

    async validate(payload: JwtPayloadDto) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}