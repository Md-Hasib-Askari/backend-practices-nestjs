import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
        <h1>CSP Inline Script Test</h1>
        <p>
          Open browser DevTools console. The inline script below should be blocked by
          Content-Security-Policy.
        </p>
        <script>
          console.log('If you see this, CSP is not strict enough.');
          alert('Inline script executed');
        </script>
      </body>
      </html>
    `;
  }
}
