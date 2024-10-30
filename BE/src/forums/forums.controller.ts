import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ForumsService } from './forums.service';
import { RequestService } from 'src/request/request.service';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetForumsDto } from './dto/get-forums.dto';
import { GetForumByIdDto } from './dto/get-forum-by-id.dto';
import { HttpStatusCode } from 'axios';
import { GetAllQuery } from './queries/get-all.query';
import { generateSlug, getQueryParams } from 'src/utils';
import { CreateForumDto } from './dto/create-forum.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { AuthGuard } from 'src/guard/user.guard';

@ApiTags('forums')
@Controller('forums')
export class ForumsController {
  constructor(
    private readonly forumsService: ForumsService,
    private readonly requestService: RequestService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  async createForum(
    @Body() body: CreateForumDto,
    @Req() req: { user: JwtPayload },
  ) {
    const slug = generateSlug(body.title, req.user.name);

    const isForumExist = await this.requestService.get(
      `/forums?filters[slug][$eq]=${slug}`,
    );

    if (isForumExist) {
      throw new BadRequestException(
        `This user already have forum with this name ${body.title}`,
      );
    }

    return this.requestService.post(`/forums`, {
      body: {
        data: {
          ...body,
          userId: req.user.id,
          userName: req.user.name,
          state: 'active',
          slug,
        },
      },
    });
  }

  @Get()
  @ApiResponse({
    status: HttpStatusCode.Ok,
    type: GetForumsDto,
  })
  async getAll(@Query() query: GetAllQuery) {
    const params = getQueryParams(query);
    return this.requestService.get(`/forums?${params}`);
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
    return this.requestService.get(`/forums/${params.id}`);
  }
}
