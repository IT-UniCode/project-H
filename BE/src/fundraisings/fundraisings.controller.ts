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

  private readonly sortByTotal = (a, b) => {
    return (
      b.total * (b.currency === 'uah' ? 1 : b.currency === 'usd' ? 2 : 3) -
      a.total * (a.currency === 'uah' ? 1 : a.currency === 'usd' ? 2 : 3)
    );
  };

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
      const payments = await this.requestService.get(
        `/fundraising-payments?filters[fundraisingId][$eq]=${params.id}&pagination[limit]=30&fields=total,userId,currency&sort[0]=currency&sort[1]=total`,
      );

      const topDonations = [];

      if (payments.data.length > 0) {
        payments.data.forEach((pay) => {
          const { total, userId, currency } = pay;
          topDonations.push({ total, userId, currency });
        });
      }

      const data = {
        data: {
          ...fetchedData.data,
          previewImage: getImageUrl(fetchedData.data.previewImage),
          topDonations: topDonations.sort(this.sortByTotal).slice(0, 10),
        },
      };
      this.cacheService.set(path, data);
      return data;
    } else {
      return cachedData;
    }
  }
}
