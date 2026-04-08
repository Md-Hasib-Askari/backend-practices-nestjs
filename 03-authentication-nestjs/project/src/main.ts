import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription('API for user authentication and management')
    .setVersion('1.0')
    .build();
  type SwaggerApp = Parameters<typeof SwaggerModule.createDocument>[0];
  const document = SwaggerModule.createDocument(app as unknown as SwaggerApp, config);

  SwaggerModule.setup('api', app as unknown as SwaggerApp, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
