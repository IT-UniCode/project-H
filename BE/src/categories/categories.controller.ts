import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './category.entity';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';

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
  @ApiQuery({
    name: 'includeNews',
    required: false,
    type: Boolean,
    description:
      'Include news in the response if set to true. If false or omitted, categories will not be included.',
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
    description: 'The name of the field to filter data by (e.g., "name").',
    example: 'name',
  })
  @ApiQuery({
    name: 'filters[value]',
    required: false,
    type: String,
    description:
      'The value the specified filter field must match (e.g., "JS", "Sport", "Politics", or a numerical value).',
    example: 'JS',
  })
  async getAll(
    @Query()
    query: {
      includeNews?: boolean;
      pagination?: { page?: number; pageSize?: number } | 'max';
      filters?: {
        field: string;
        value: string | number;
      };
    },
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
