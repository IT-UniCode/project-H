import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { News, NewsWithCategories } from './dto/news.dto';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';
import { NewsQuery } from './query/query-news.query';
import { getQueryParams } from 'src/utils';

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

    const params = getQueryParams(query, 'category');

    const path = `news?${includeCategories}${params}`;
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
