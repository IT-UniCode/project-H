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

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  @Get('')
  @ApiResponse({
    status: 200,
    description: 'User',
    type: Category,
  })
  async getAll() {
    const res = await axios(`${process.env.API_URL}/categories`);
    const data = res.data;

    return data;
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'User',
    type: Category,
  })
  async getById(@Param() params: { id: number }) {
    const res = await axios(`${process.env.API_URL}/categories/${params.id}`);
    const data = res.data;

    return data;
  }

  @Post('')
  @ApiResponse({
    status: 200,
    description: 'User',
  })
  async add(@Body() body: CreateCategoryDto) {
    const res = await axios.post(
      `${process.env.API_URL}/categories`,
      { data: body },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return res.status;
  }

  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'User',
  })
  async update(
    @Body() body: CreateCategoryDto,
    @Param() params: { id: number },
  ) {
    const res = await axios.put(
      `${process.env.API_URL}/categories/${params.id}`,
      { data: body },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return res.status;
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'User',
  })
  async delete(@Param() params: { id: number }) {
    const res = await axios.delete(
      `${process.env.API_URL}/categories/${params.id}`,
    );

    return res.status;
  }
}
