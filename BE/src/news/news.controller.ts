import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import axios from 'axios';
import { CreateNewsDto } from './dto/create-news.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { News } from './news.enetity';
import { RequestService } from 'src/request/request.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(public requestService: RequestService) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'User',
    type: News,
  })
  async getAll() {
    const res = await this.requestService.get('news?populate=category');

    return res;
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'User',
    type: News,
  })
  async getById(@Param() params: { id: number }) {
    const res = await this.requestService.get(
      `news/${params.id}?populate=category`,
    );

    return res;
  }

  @Post('')
  @ApiResponse({
    status: 200,
    description: 'User',
  })
  async add(@Body() body: CreateNewsDto) {
    const res = await this.requestService.post(`news`, {
      body: { data: body },
    });

    return res;
  }

  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'Status',
  })
  async update(@Body() body: CreateNewsDto, @Param() params: { id: number }) {
    const res = await this.requestService.put(`news/${params.id}`, {
      body: { data: body },
    });

    return res;
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'Status',
  })
  async delete(@Param() params: { id: number }) {
    const res = await this.requestService.delete(`news/${params.id}`);

    return res;
  }
}
