import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from 'src/request/request.service';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetForumsDto } from './dto/get-forums.dto';
import { GetForumByIdDto } from './dto/get-forum-by-id.dto';
import { GetAllQuery } from './queries/get-all.query';
import { generateSlug, getQueryParams } from 'src/utils';
import { CreateForumDto } from './dto/create-forum.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { AuthGuard } from 'src/guard/user.guard';
import { CacheService } from 'src/cache/cache.service';
import { UpdateForumDto } from './dto/update-forum.dto';

@ApiTags('forums')
@Controller('forums')
export class ForumsController {
  constructor(
    private readonly requestService: RequestService,
    private readonly cacheService: CacheService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetForumByIdDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'This user already have forum with this name Some title',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  async createForum(
    @Body() body: CreateForumDto,
    @Req() req: { user: JwtPayload },
  ) {
    const slug = generateSlug(body.title);

    const isForumExist = await this.requestService.get(
      `/forums?filters[slug][$eq]=${slug}`,
    );

    if (isForumExist.data.length > 0) {
      throw new BadRequestException(
        `This user already have forum with this name ${body.title}`,
      );
    }

    return this.requestService.post(`/forums`, {
      body: {
        data: {
          ...body,
          userId: req.user.id,
          state: 'active',
          slug,
        },
      },
    });
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetForumsDto,
  })
  async getAll(@Query() query: GetAllQuery) {
    const params = getQueryParams(query);
    const path = `/forums?${params}`;

    const cachedData = await this.cacheService.get(path);

    if (!cachedData) {
      const data = await this.requestService.get(path);

      await this.cacheService.set(path, data);

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
    type: GetForumByIdDto,
    status: HttpStatus.OK,
  })
  async getById(@Param() params: { id: string }) {
    const path = `/forums/${params.id}`;

    const cachedData = await this.requestService.get(path);

    if (!cachedData) {
      const data = await this.requestService.get(path);

      await this.cacheService.set(path, data);

      return data;
    } else {
      return cachedData;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Put('/:id')
  async updateForum(
    @Body() body: UpdateForumDto,
    @Req() req: { user: JwtPayload },
    @Param() params: { id: string },
  ) {
    const path = `/forums/${params.id}`;

    const forum = await this.requestService.get(path);

    if (forum.data.userId !== req.user.id) {
      throw new BadRequestException(
        `This user with id ${req.user.id} is not a author of forum with id ${params.id}`,
      );
    }

    return this.requestService.put(path, {
      body: { data: body },
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    example: 204,
  })
  @Delete('/:id')
  async deleteForum(
    @Req() req: { user: JwtPayload },
    @Param() params: { id: string },
  ) {
    const path = `/forums/${params.id}`;

    const forum = await this.requestService.get(path);

    if (forum.data.userId !== req.user.id) {
      throw new BadRequestException(
        `This user with id ${req.user.id} is not a author of forum with id ${params.id}`,
      );
    }

    return this.requestService.delete(path);
  }
}
