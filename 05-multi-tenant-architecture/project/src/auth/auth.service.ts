import { ConflictException, Inject, Injectable, Logger, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => RolesService)) private readonly rolesService: RolesService,
        private readonly jwtService: JwtService,
    ) { }
    private logger = new Logger(AuthService.name);

    async register(dto: RegisterDto, tenantId: string) {
        const existing = await this.usersService.findByEmail(dto.email, tenantId);
        if (existing) throw new ConflictException('Email already registered in this tenant');

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create(
            { ...dto, password: hashed },
            tenantId,
        );

        return { message: 'User registered successfully', userId: user._id };
    }

    async login(dto: LoginDto, tenantId: string) {
        const user = await this.usersService.findByEmail(dto.email, tenantId);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        this.logger.log(user.roleId);
        const role = await this.rolesService.findOne(user.roleId.toString(), tenantId);
        const permissions = role ? role.permissions : [];

        const payload: JwtPayload = {
            sub: user._id.toString(),
            email: user.email,
            role: role.name ?? 'guest',
            permissions,
            tenantId: user.tenantId,
        };

        return { access_token: this.jwtService.sign(payload) };
    }
}
