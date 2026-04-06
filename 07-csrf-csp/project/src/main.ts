import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import helmet from 'helmet';
import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';

const doubleCsrfOptions: DoubleCsrfConfigOptions = {
  getSecret: (req) => {
    // In a real application, you should use a more secure way to manage secrets.
    // This is just for demonstration purposes.
    return process.env.CSRF_SECRET ?? 'dev-insecure-csrf-secret';
  },
  getSessionIdentifier: (req: any) => req.sessionID ?? req.ip ?? 'anonymous-session',
  cookieName: 'XSRF-TOKEN', // Name of the cookie to store the CSRF token
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
  },
  getCsrfTokenFromRequest: (req: any) => {
    const headerToken = req.headers?.['x-csrf-token'];
    if (typeof headerToken === 'string') {
      return headerToken;
    }

    const body = req.body as { _csrf?: string } | undefined;
    return body?._csrf;
  },
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], // HTTP methods to ignore for CSRF protection
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(
    json({
      type: [
        'application/json',
        'application/csp-report',
        'application/reports+json',
        'application/*+json',
      ],
    }),
  );
  app.use(urlencoded({ extended: false }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'dev-insecure-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
      },
    }),
  );

  const {
    doubleCsrfProtection, // This is the default CSRF protection middleware.
  } = doubleCsrf(doubleCsrfOptions);
  app.use(doubleCsrfProtection);

  app.use(
    // helmet(),
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        reportOnly: true, // Report violations without blocking resources
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
