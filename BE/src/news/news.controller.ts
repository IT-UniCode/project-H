import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({
    name: 'includeCategories',
    required: false,
    type: Boolean,
    description:
      'Include categories in the response if set to true. If false or omitted, categories will not be included.',
  })
  @ApiQuery({
    name: 'pagination[page]',
    required: false,
    type: Number,
    description: 'Specify the page number to retrieve. Default is 1.',
    example: 1,
  })
  @ApiQuery({
    name: 'pagination[pageSize]',
    required: false,
    type: Number,
    description: 'Specify the number of items per page. Default is 25.',
    example: 25,
  })
  @ApiQuery({
    name: 'pagination',
    required: false,
    type: String,
    description:
      'If set to "max", returns all the data without pagination. Overrides page and pageSize parameters.',
    example: 'max',
  })
  @ApiQuery({
    name: 'filters[field]',
    required: false,
    type: String,
    description:
      'The name of the field to filter data by (e.g., "title", "category").',
    example: 'title',
  })
  @ApiQuery({
    name: 'filters[value]',
    required: false,
    type: String,
    description:
      'The value the specified filter field must match (e.g., "JS", "Sport", "Politics" or a numerical value).',
    example: 'Some title',
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
