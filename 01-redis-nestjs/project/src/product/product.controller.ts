import { Controller, Get, Post, Param, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productService.getProduct(+id);
  }

  @Post(':id/invalidate')
  invalidateCache(@Param('id') id: string) {
    return this.productService.invalidateCache(+id);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30_000) // Cache this route for 30 seconds (ms)
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id/detail')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60_000) // Cache this route for 60 seconds (ms)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

}
