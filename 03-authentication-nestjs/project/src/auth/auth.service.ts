import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly logger: Logger
    ) { }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        const isMatch = await this.verifyPassword(password, user.password);
        if (!isMatch) {
            return null;
        }
        return user;
    }

    async register(email: string, password: string) {
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await this.hashPassword(password);
        return this.usersService.create({ email, password: hashedPassword });
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);
        if (!user) {
            return { message: 'Invalid credentials' };
        }
        const payload = { email: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
