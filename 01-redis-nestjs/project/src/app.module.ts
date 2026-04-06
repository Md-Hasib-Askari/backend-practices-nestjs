import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductModule } from './product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl =
          configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
        const redisPassword = configService.get<string>('REDIS_PASSWORD');

        const redisUrlWithAuth =
          redisPassword && !redisUrl.includes('@')
            ? redisUrl.replace(
              'redis://',
              `redis://:${encodeURIComponent(redisPassword)}@`,
            )
            : redisUrl;

        return {
          // cache-manager v7 uses milliseconds
          ttl: 5_000, // 5 seconds
          stores: [createKeyv(redisUrlWithAuth)],
        };
      },
    }),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
