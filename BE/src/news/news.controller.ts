import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { News } from './news.enetity';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(
    public requestService: RequestService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'News',
    type: News,
  })
  async getAll(
    @Query()
    query?: {
      includeCategories?: boolean;
      pagination?: { page?: number; pageSize?: number } | 'max';
      filters?: {
        field: string;
        value: string | number;
      };
    },
  ) {
    const includeCategories = query.includeCategories
      ? 'populate=category&'
      : '';
    const pagination = query.pagination
      ? query.pagination === 'max'
        ? 'pagination[limit]=max&'
        : `pagination[page]=${query.pagination.page || 0}&pagination[pageSize]=${query.pagination.pageSize || 25}&`
      : '';

    const filters = query.filters
      ? `filters[${query.filters.field}][id]=${query.filters.value}&`
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
