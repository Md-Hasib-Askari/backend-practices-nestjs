import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App Controller')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('Hello Endpoint')
  @ApiOperation({ summary: 'Get a greeting message' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('number')
  @ApiOperation({ summary: 'Get a number' })
  @ApiResponse({ status: 200, description: 'Successful response', type: Number })
  getNumber(): number {
    return 42;
  }

  @Get('get-product/:id')
  @ApiParam({ name: 'id', description: 'Product ID', type: String })
  @ApiOperation({ summary: 'Get a product' })
  @ApiResponse({ status: 200, description: 'Successful response', type: Object })
  getProduct(@Param('id') id: string): object {
    return { id, name: 'Product 1', price: 100 };
  }
}
