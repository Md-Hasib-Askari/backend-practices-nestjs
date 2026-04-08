import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

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

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email, roles: payload.roles };
    }
}