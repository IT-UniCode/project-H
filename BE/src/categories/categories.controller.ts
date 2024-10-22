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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RequestService } from 'src/request/request.service';
import { AuthGuard } from 'src/guard/user.guard';

@UseGuards(AuthGuard)
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
    return this.requestService.get('categories');
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'Category',
    type: Category,
  })
  async getById(@Param() params: { id: number }) {
    return this.requestService.get(`categories/${params.id}`);
  }

  @Post('')
  @ApiResponse({
    status: 200,
    description: 'Category',
  })
  async add(@Body() body: CreateCategoryDto) {
    return this.requestService.post(`categories`, {
      body: { data: body },
    });
  }

  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'Category',
  })
  async update(
    @Body() body: CreateCategoryDto,
    @Param() params: { id: string },
  ) {
    return this.requestService.put(`categories/${params.id}`, {
      body: { data: body },
    });
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'Category',
  })
  async delete(@Param() params: { id: number }) {
    return this.requestService.delete(`categories/${params.id}`);
  }
}
