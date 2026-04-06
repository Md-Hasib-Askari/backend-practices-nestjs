import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      // cache-manager v7 uses milliseconds
      ttl: 5_000, // 5 seconds
      max: 100, // maximum number of items in cache
      // store: 'redis',
    }),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
