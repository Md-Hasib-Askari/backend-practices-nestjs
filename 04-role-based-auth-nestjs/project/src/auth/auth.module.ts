import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'your_jwt_secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
