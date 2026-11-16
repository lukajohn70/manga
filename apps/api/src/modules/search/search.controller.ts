import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService, SearchQueryDto } from './search.service.js';

@Controller('v1')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search')
  public async search(@Query() query: SearchQueryDto) {
    return await this.searchService.searchProducts(query);
  }

  @Get('products/:id')
  public async getProductDetails(@Param('id') id: string) {
    return await this.searchService.getProductDetails(id);
  }
}
