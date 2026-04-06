import { Body, Controller, Get, Header, HttpCode, Logger, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { CsrfTokenGeneratorRequestUtil } from 'csrf-csrf';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('login-demo')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getLoginDemoPage(@Req() req: Request): string {
    const session = req.session as typeof req.session & { csrfSeeded?: boolean };
    session.csrfSeeded = true;

    const csrfToken = (req as Request & { csrfToken?: CsrfTokenGeneratorRequestUtil }).csrfToken?.() ?? '';

    return `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Victim Login Demo</title>
      </head>
      <body>
        <h1>Victim Login (Cookie Session)</h1>
        <p>Use this page first to create a session cookie in your browser.</p>
        <form method="POST" action="/auth/login">
          <input type="hidden" name="_csrf" value="${csrfToken}" />
          <label>
            User ID
            <input name="userId" value="alice" />
          </label>
          <button type="submit">Login</button>
        </form>
      </body>
      </html>
    `;
  }

  @Post('auth/login')
  login(
    @Req() req: Request,
    @Body() body: { userId?: string },
  ) {
    const session = req.session as typeof req.session & { userId?: string };
    const userId = (body?.userId ?? 'demo-user').trim() || 'demo-user';
    session.userId = userId;

    return {
      ok: true,
      message: 'Logged in with cookie-based session',
      userId,
      sessionId: req.sessionID,
    };
  }

  @Post('transfer')
  transfer(
    @Req() req: Request,
    @Body() body: { amount?: string | number; to?: string },
  ) {
    const session = req.session as typeof req.session & { userId?: string };

    if (!session.userId) {
      return {
        ok: false,
        message: 'No active session. Login first using POST /auth/login.',
      };
    }

    const amount = body?.amount ?? '1000';
    const to = body?.to ?? 'attacker';

    this.logger.warn(
      `Transfer executed for user=${session.userId}, amount=${amount}, to=${to}`,
    );

    return {
      ok: true,
      fromUserId: session.userId,
      to,
      amount,
      message: 'Transfer executed without CSRF protection (intentionally vulnerable baseline).',
    };
  }

  @Get('csp-test')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getCspTestPage(): string {
    return `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>CSP Test</title>
      </head>
      <body>
        <h1>CSP Report-Only Test</h1>
        <p>
          This page intentionally violates your CSP (inline script + external image).
          In report-only mode, these are not blocked, but violations are sent to /csp-report.
        </p>

        <img
          src="https://example.com/favicon.ico"
          alt="External image used to trigger img-src violation"
          width="120"
          height="120"
        />

        <script>
          console.log('Inline script executed in report-only mode.');
        </script>
      </body>
      </html>
    `;
  }

  @Post('csp-report')
  @HttpCode(204)
  cspReport(@Body() body?: Record<string, unknown>) {
    console.log('CSP report body:', body);

    const report = body?.['csp-report'] ?? body;

    this.logger.debug(`Received CSP violation report: ${JSON.stringify(report)}`);

    if (!report) {
      this.logger.warn('CSP violation report received without a request body');
      return;
    }

    this.logger.warn(`CSP violation: ${JSON.stringify(report)}`);
    // alert to Slack / store in DB for analysis
  }
}
