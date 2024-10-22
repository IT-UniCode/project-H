import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { News } from './news.enetity';
import { RequestService } from 'src/request/request.service';
import { AuthGuard } from 'src/guard/user.guard';

@UseGuards(AuthGuard)
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
    return this.requestService.get('news?populate=category');
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'User',
    type: News,
  })
  async getById(@Param() params: { id: number }) {
    return this.requestService.get(`news/${params.id}?populate=category`);
  }

  @Post('')
  @ApiResponse({
    status: 200,
    description: 'User',
  })
  async add(@Body() body: CreateNewsDto) {
    return this.requestService.post(`news`, {
      body: { data: body },
    });
  }

  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'Status',
  })
  async update(@Body() body: CreateNewsDto, @Param() params: { id: number }) {
    return this.requestService.put(`news/${params.id}`, {
      body: { data: body },
    });
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'Status',
  })
  async delete(@Param() params: { id: number }) {
    return this.requestService.delete(`news/${params.id}`);
  }
}
