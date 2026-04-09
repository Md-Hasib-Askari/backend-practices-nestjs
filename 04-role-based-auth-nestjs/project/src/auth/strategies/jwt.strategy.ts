import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../dto/jwt-payload.dto";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    let data = null;
                    if (req && req.cookies) {
                        data = req.cookies['access_token'];
                    }
                    return data;
                }
            ]),
            secretOrKey: 'your_jwt_secret',
        });
    }

    async validate(payload: JwtPayload) {
        return { sub: payload.sub, email: payload.email, roles: payload.roles };
    }
}