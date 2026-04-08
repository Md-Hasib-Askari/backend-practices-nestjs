import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "src/auth/auth.service";
import { LoginDto } from "src/auth/dto/login.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService
    ) {
        super({ usernameField: 'email' });
    }

    async validate(loginDto: LoginDto): Promise<any> {
        const { email, password } = loginDto;
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}