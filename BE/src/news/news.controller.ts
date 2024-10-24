import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { News, NewsWithCategories } from './news.enetity';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';
import { NewsQuery } from './query/query-news.query';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(
    public requestService: RequestService,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'News',
    type: NewsWithCategories,
  })
  async getAll(
    @Query()
    query?: NewsQuery,
  ) {
    const includeCategories = query.includeCategories
      ? 'populate=category&'
      : '';
    const pagination = query.pagination
      ? query.pagination === 'max'
        ? 'pagination[limit]=max&'
        : `pagination[page]=${query.pagination.page || 0}&pagination[pageSize]=${query.pagination.pageSize || 25}&`
      : '';

    const filters =
      query.filters && query.filters.field && query.filters.value
        ? `filters[${query.filters.field}][documentId]=${query.filters.value}&`
        : '';

    const path = `news?${includeCategories}${pagination}${filters}`;
    const data = await this.cacheService.get(path);

    if (!data) {
      const data = await this.requestService.get(path);

      this.cacheService.set(path, data);

      return data;
    } else {
      return data;
    }
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'News',
    type: News,
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  async getById(@Param() params: { id: number }) {
    const data = await this.cacheService.get(`news_${params.id}`);

    if (!data) {
      const data = await this.requestService.get(
        `news/${params.id}?populate=category`,
      );
      this.cacheService.set(`news_${params.id}`, data);
      return data;
    } else {
      return data;
    }
  }
}
