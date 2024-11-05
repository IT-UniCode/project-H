import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheService } from 'src/cache/cache.service';
import { RequestService } from 'src/request/request.service';
import { getQueryParams, getImageUrl } from 'src/utils';
import { FundraisingQuery } from './query/fundraising.query.dto';
import { GetFundraisingsDto } from './dto/get-fund.sto';
import { GetFundraisingByIdDto } from './dto/get-fund-by-id.dto';
@ApiTags('fundraisings')
@Controller('fundraisings')
export class FundraisingsController {
  constructor(
    private readonly requestService: RequestService,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fundraisings',
    type: GetFundraisingsDto,
  })
  async getAll(
    @Query()
    query?: FundraisingQuery,
  ) {
    const includeCategories = query.includeCategories
      ? 'populate=fundraising_category&'
      : '';

    const params = getQueryParams(query, 'fundraising_category');

    const path = `/fundraisings?populate[fundraising_category][fields]=documentId,name,slug&populate[previewImage][fields]=url,formats&fields=id,title,previewText,slug,createdAt&${includeCategories}${params}`;
    const cachedData = await this.cacheService.get(path);

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
    description: 'Fundraisings',
    type: GetFundraisingByIdDto,
  })
  @ApiParam({
    name: 'id',
  })
  async getById(@Param() params: { id: string }) {
    const path = `/fundraisings/${params.id}`;

    const cachedData = await this.cacheService.get(path);

    if (!cachedData) {
      const fetchedData = await this.requestService.get(
        `${path}?populate[fundraising_category][fields]=documentId,name,slug&populate[previewImage][fields]=url,formats`,
      );
      this.cacheService.set(path, fetchedData);
      return {
        data: {
          ...fetchedData.data,
          previewImage: getImageUrl(fetchedData.data.previewImage),
        },
      };
    } else {
      return cachedData;
    }
  }
}
