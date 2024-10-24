import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreateVotingDto } from './dto/create-voting.dto';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';
import { getQueryParams } from 'src/utils';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('votings')
@Controller('votings')
export class VotingsController {
  constructor(
    private readonly requestService: RequestService,
    private readonly cacheService: CacheService,
  ) {}

  @Post()
  create(@Body() body: CreateVotingDto) {
    return this.requestService.post('voting', { body });
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Voting',
    // type: NewsWithCategories,
  })
  async getAll(
    @Query()
    query?: any,
  ) {
    const params = getQueryParams(query, '');
    const path = `votings${params}`;
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
