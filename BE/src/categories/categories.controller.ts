import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './category.entity';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';
import { CategoriesQuery } from './query/query-categories.query';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    public requestService: RequestService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Category',
    type: Category,
  })
  async getAll(
    @Query()
    query: CategoriesQuery,
  ) {
    const data = await this.cacheService.get('categories');

    if (!data) {
      const includeNews = query.includeNews ? 'populate=news&' : '';

      const pagination = query.pagination
        ? query.pagination === 'max'
          ? 'pagination[limit]=max&'
          : `pagination[page]=${query.pagination.page || 0}&pagination[pageSize]=${query.pagination.pageSize || 25}&`
        : '';

      const filters = query.filters
        ? `filters[${query.filters.field}][id]=${query.filters.value}&`
        : '';

      const data = await this.requestService.get(
        `categories?${includeNews}${pagination}${filters}`,
      );

      this.cacheService.set('categories', data);

      return data;
    } else {
      return data;
    }
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Category',
    type: Category,
  })
  async getById(@Param() params: { id: number }) {
    const data = await this.cacheService.get(`categories_${params.id}`);

    if (!data) {
      const data = await this.requestService.get(`categories/${params.id}`);

      this.cacheService.set(`categories_${params.id}`, data);

      return data;
    } else {
      return data;
    }
  }
}
