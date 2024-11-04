import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheService } from 'src/cache/cache.service';
import { RequestService } from 'src/request/request.service';
import { getQueryParams } from 'src/utils';
import { GetFundraisingCategoryQuery } from './query/get-fundraising-category.query';
import { FundraisingCategoriesResponse } from './dto/fundraising-categories.dto';

@ApiTags('fundraising-categories')
@Controller('fundraising-categories')
export class FundraisingCategoriesController {
  constructor(
    private readonly requestService: RequestService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Category',
    type: FundraisingCategoriesResponse,
  })
  async getAll(
    @Query()
    query?: GetFundraisingCategoryQuery,
  ) {
    const includeFundraisings = query.includeFundraisings
      ? 'populate=fundraisings&'
      : '';

    const params = getQueryParams(query);

    const path = `/fundraising-categories?${includeFundraisings}${params}`;

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
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Category',
    type: FundraisingCategoriesResponse,
  })
  async getById(@Param() params: { id: string }) {
    const path = `/fundraising-categories/${params.id}`;
    const data = await this.cacheService.get(path);

    if (!data) {
      const data = await this.requestService.get(path);

      this.cacheService.set(path, data);

      return data;
    } else {
      return data;
    }
  }
}
