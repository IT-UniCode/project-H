import { Controller, Get, Param } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { RequestService } from 'src/request/request.service';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetForumsDto } from './dto/get-forums.dto';
import { GetForumByIdDto } from './dto/get-forum-by-id.dto';
import { HttpStatusCode } from 'axios';

@ApiTags('forums')
@Controller('forums')
export class ForumsController {
  constructor(
    private readonly forumsService: ForumsService,
    private readonly requestService: RequestService,
  ) {}

  @Get()
  @ApiResponse({
    type: GetForumsDto,
  })
  async getAll() {
    return this.requestService.get('forums');
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
