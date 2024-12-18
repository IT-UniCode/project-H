import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category, CategoryWithNews } from './category.entity';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';
import { CategoriesQuery } from './query/query-categories.query';
import { getQueryParams } from 'src/utils';

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
    type: CategoryWithNews,
  })
  async getAll(
    @Query()
    query?: CategoriesQuery,
  ) {
    const includeNews = query.includeNews ? 'populate=news&' : '';

    const params = getQueryParams(query, 'news');

    const path = `/categories?${includeNews}${params}`;

    const cachedData = await this.cacheService.get(path);

    if (!cachedData) {
      const data = await this.requestService.get(path);

      this.cacheService.set(path, data);

      return data;
    } else {
      return cachedData;
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
  async getById(@Param() params: { id: string }) {
    const data = await this.cacheService.get(`categories_${params.id}`);

    if (!data) {
      const data = await this.requestService.get(`/categories/${params.id}`);

      this.cacheService.set(`/categories_${params.id}`, data);

      return data;
    } else {
      return data;
    }
  }
}
