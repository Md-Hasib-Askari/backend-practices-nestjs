import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = SwaggerModule.createDocument(app, new DocumentBuilder().build());

  SwaggerModule.setup('api', app, config);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
