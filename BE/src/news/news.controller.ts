import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { News } from './news.enetity';
import { RequestService } from 'src/request/request.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(public requestService: RequestService) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'User',
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

    return this.requestService.get(
      `news?${includeCategories}${pagination}${filters}`,
    );
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'User',
    type: News,
  })
  async getById(@Param() params: { id: number }) {
    return this.requestService.get(`news/${params.id}?populate=category`);
  }
}
