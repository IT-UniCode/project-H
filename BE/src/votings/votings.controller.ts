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
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { AuthGuard } from 'src/guard/user.guard';
import { AnswerGetDto } from './dto/answer.get.dto';
import { VotingAnswerCreateDto } from './dto/voting.answer.create.dto';
import { VotingsPostService } from './votings.post.service';
import { HttpStatusCode } from 'axios';
import { PostVoteDto } from './dto/post-vote.dto';

@ApiTags('votings')
@Controller('votings')
export class VotingsController {
  constructor(
    private readonly requestService: RequestService,
    private readonly cacheService: CacheService,
    private readonly votingsPostService: VotingsPostService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: HttpStatusCode.Created,
    type: PostVoteDto,
  })
  @Post()
  async vote(@Body() body: VotingAnswerCreateDto, @Req() req) {
    return this.votingsPostService.post(
      body.votingId,
      body.answer,
      req.user.id,
    );
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
    const path = `votings?${params}&populate=variants`;
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
    const path = `votings/${params.id}&populate=variants`;
    const cachedData = await this.cacheService.get(path);

    if (!cachedData) {
      const data = await this.requestService.get(path);

      this.cacheService.set(path, data);

      return data;
    } else {
      return cachedData;
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({
    type: AnswerGetDto,
  })
  @Get('/answers/:id')
  async getResults(
    @Param() params: { id: string },
    @Req() req: { user: JwtPayload },
  ) {
    const a = {};
    const ids = params.id.split(',');

    await Promise.all(
      ids.map(async (id) => {
        const ans = await this.requestService.get(
          `answers?filters[userId][$eq]=${req.user.id}&filters[votingId][$eq]=${id}`,
        );
        a[id] = ans.data[0]?.answer || null;
      }),
    );

    return a;
  }
}
