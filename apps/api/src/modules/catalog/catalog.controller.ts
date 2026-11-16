import { Controller, Post, Body, Param } from '@nestjs/common';
import {
  CatalogService,
  CreateCategoryDto,
  DefineAttributeDto,
  CreateMasterProductDto,
  CreateVariantDto,
} from './catalog.service.js';

@Controller('v1/catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('categories')
  public async createCategory(@Body() dto: CreateCategoryDto) {
    return await this.catalogService.createCategory(dto);
  }

  @Post('attributes')
  public async defineAttribute(@Body() dto: DefineAttributeDto) {
    return await this.catalogService.defineAttribute(dto);
  }

  @Post('products')
  public async createMasterProduct(@Body() dto: CreateMasterProductDto) {
    return await this.catalogService.createMasterProduct(dto);
  }

  @Post('variants')
  public async createVariant(@Body() dto: CreateVariantDto) {
    return await this.catalogService.createVariant(dto);
  }

  @Post('products/:id/moderate')
  public async moderateProduct(
    @Param('id') id: string,
    @Body('status') status: 'published' | 'rejected'
  ) {
    return await this.catalogService.moderateProduct(id, status);
  }
}
