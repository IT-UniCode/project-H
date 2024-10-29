import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';
import { getQueryParams } from 'src/utils';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseVoting } from './entities/voting.entity';
import { VotingQuery } from './queries/query-voting.query';
import { AnswerCreateDto } from './dto/answer.create.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { AuthGuard } from 'src/guard/user.guard';

@ApiTags('votings')
@Controller('votings')
export class VotingsController {
  constructor(
    private readonly requestService: RequestService,
    private readonly cacheService: CacheService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async vote(@Body() body: AnswerCreateDto, @Req() req: { user: JwtPayload }) {
    const path = `answers`;

    return this.requestService.post(path, {
      body: { data: { ...body, userId: req.user.id } },
    });
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Votings',
    type: ResponseVoting,
  })
  async getAll(
    @Query()
    query?: VotingQuery,
  ) {
    const params = getQueryParams(query);
    const path = `votings?populate=variants&${params}&filters[state][$eq]=active`;
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
    description: 'Votings',
    type: ResponseVoting,
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'ew1da2sss678yd4yhu3lrje2',
  })
  async getById(
    @Param()
    params: {
      id: string;
    },
  ) {
    const path = `votings/${params.id}`;
    const cachedData = await this.cacheService.get(path);

    if (!cachedData) {
      const data = await this.requestService.get(path);

      this.cacheService.set(path, data);

      return data;
    } else {
      return cachedData;
    }
  }
}
