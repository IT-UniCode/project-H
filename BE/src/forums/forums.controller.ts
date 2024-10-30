import { Controller, Get, Param, Query } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { RequestService } from 'src/request/request.service';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetForumsDto } from './dto/get-forums.dto';
import { GetForumByIdDto } from './dto/get-forum-by-id.dto';
import { HttpStatusCode } from 'axios';
import { GetAllQuery } from './queries/get-all.query';
import { getQueryParams } from 'src/utils';

@ApiTags('forums')
@Controller('forums')
export class ForumsController {
  constructor(
    private readonly forumsService: ForumsService,
    private readonly requestService: RequestService,
  ) {}

  @Get()
  @ApiResponse({
    status: HttpStatusCode.Ok,
    type: GetForumsDto,
  })
  async getAll(@Query() query: GetAllQuery) {
    const params = getQueryParams(query);
    return this.requestService.get(`forums?${params}`);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({
    type: GetForumByIdDto,
    status: HttpStatusCode.Ok,
  })
  async getById(@Param() params: { id: string }) {
    return this.requestService.get(`forums/${params.id}`);
  }
}
