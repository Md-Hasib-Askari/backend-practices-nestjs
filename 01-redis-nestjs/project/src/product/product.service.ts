import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async getProduct(id: number) {
    const cacheKey = `product:${id}`;
    const cachedProduct = await this.cacheManager.get(cacheKey);
    if (cachedProduct) {
      console.log('Returning cached product');
      return cachedProduct;
    }

    // Simulate fetching product from database
    const product = { id, name: `Product ${id}`, price: id * 10 };

    // Cache the product for future requests
    await this.cacheManager.set(cacheKey, product, 60_000); // Cache for 60 seconds (ms)

    console.log('Returning new product');
    return product;
  }

  async invalidateCache(id: number) {
    const cacheKey = `product:${id}`;
    await this.cacheManager.del(cacheKey);
    console.log('Cache invalidated for product:', id);
  }

  async findAll() {
    const date = new Date();

    // Simulate fetching all products from database
    return [
      { id: 1, name: 'Product 1', price: 10, date },
      { id: 2, name: 'Product 2', price: 20, date },
      { id: 3, name: 'Product 3', price: 30, date },
    ];
  }

  async findOne(id: number) {
    const date = new Date();

    // Simulate fetching a single product from database
    return { id, name: `Product ${id}`, price: id * 10, date };
  }
}
