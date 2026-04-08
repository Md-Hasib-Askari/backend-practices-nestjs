import { Logger, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from '../strategy/local.strategy';
import { JwtStrategy } from '../strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'your_jwt_secret',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, ConfigService, Logger],
})
export class AuthModule { }
