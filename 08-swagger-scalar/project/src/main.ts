import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Swagger Example')
    .setDescription('API documentation for Swagger example')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local server')
    .addServer('http://localhost:5000', 'Local server')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: '/api-json',
  });

  app.use('/docs', apiReference({
    title: 'API Reference',
    // content: documentFactory(),
    url: '/api-json',
    theme: 'saturn',
    layout: 'modern',
    defaultHttpClient: {
      targetKey: 'js',
      clientKey: 'fetch'
    },
    metaData: {
      version: '1.0',
      description: 'API documentation for Swagger example',
    },
  }))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
