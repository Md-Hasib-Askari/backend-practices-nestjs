import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    json({
      type: ['application/csp-report', 'application/reports+json'],
    }),
  );

  app.use(
    // helmet(),
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        reportOnly: false, // Set to true to only report violations without enforcing the policy
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'none'"],
          formAction: ["'self'"],
          reportUri: '/csp-report', // Endpoint to receive violation reports
        },
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
