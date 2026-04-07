import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

const WINDOW_MS = 60_000;
const LIMIT_PER_WINDOW = 10;
const requestCounters = new Map<string, { windowStart: number; count: number }>();

function getClientKey(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }

  return req.ip ?? 'unknown';
}

function fixedWindowRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const now = Date.now();
  const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS;
  const key = getClientKey(req);

  const existingCounter = requestCounters.get(key);
  if (!existingCounter || existingCounter.windowStart !== windowStart) {
    requestCounters.set(key, { windowStart, count: 0 });
  }

  const counter = requestCounters.get(key)!;
  counter.count += 1;

  const remaining = Math.max(0, LIMIT_PER_WINDOW - counter.count);
  const resetInSeconds = Math.ceil((windowStart + WINDOW_MS - now) / 1000);

  res.setHeader('X-RateLimit-Limit', LIMIT_PER_WINDOW.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', resetInSeconds.toString());

  if (counter.count > LIMIT_PER_WINDOW) {
    res.status(429).json({
      statusCode: 429,
      message: 'Too Many Requests',
      details: {
        limit: LIMIT_PER_WINDOW,
        windowMs: WINDOW_MS,
        resetInSeconds,
      },
    });
    return;
  }

  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(fixedWindowRateLimiter);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
