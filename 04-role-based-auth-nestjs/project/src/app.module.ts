import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://root:root@localhost:27017/nestjs-practice?authSource=admin',
      }),
    }),
    AuthModule, UsersModule, PostsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
