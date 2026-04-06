import { Body, Controller, Get, Header, HttpCode, Logger, Post } from '@nestjs/common';
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
