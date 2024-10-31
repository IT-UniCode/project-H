import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { News, NewsWithCategories } from './dto/news.dto';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';
import { NewsQuery } from './query/query-news.query';
import { getImageUrl, getQueryParams } from 'src/utils';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(
    public requestService: RequestService,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
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

    const path = `/news?populate=previewImage&${includeCategories}${params}`;
    const cachedData = null;

    if (!cachedData) {
      const data = await this.requestService.get(path);

      const newData = [
        ...data.data.map((obj) => {
          return {
            ...obj,
            previewImage: getImageUrl(obj.previewImage),
          };
        }),
      ];

      this.cacheService.set(path, { data: newData, meta: data.meta });

      return { data: newData, meta: data.meta };
    } else {
      return cachedData;
    }
  }

  @Get('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
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
        `/news/${params.id}?populate=category`,
      );
      this.cacheService.set(`news_${params.id}`, data);
      return data;
    } else {
      return data;
    }
  }
}
