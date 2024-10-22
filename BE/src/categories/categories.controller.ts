import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RequestService } from 'src/request/request.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(public requestService: RequestService) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Category',
    type: Category,
  })
  async getAll() {
    const res = await this.requestService.get('categories');

    return res;
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'Category',
    type: Category,
  })
  async getById(@Param() params: { id: number }) {
    const res = await this.requestService.get(`categories/${params.id}`);

    return res;
  }

  @Post('')
  @ApiResponse({
    status: 200,
    description: 'Category',
  })
  async add(@Body() body: CreateCategoryDto) {
    console.log('here-body:', body);

    const res = await this.requestService.post(`categories`, {
      body: { data: body },
    });

    return res;
  }

  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'Category',
  })
  async update(
    @Body() body: CreateCategoryDto,
    @Param() params: { id: number },
  ) {
    const res = await this.requestService.post(`categories/${params.id}`, {
      body: { data: body },
    });

    return res;
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'Category',
  })
  async delete(@Param() params: { id: number }) {
    const res = await this.requestService.delete(`categories/${params.id}`);

    return res;
  }
}
