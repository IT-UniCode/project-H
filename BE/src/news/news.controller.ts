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

@ApiTags('news')
@Controller('news')
export class NewsController {
  @Get('')
  @ApiResponse({
    status: 200,
    description: 'User',
    type: News,
  })
  async getAll() {
    try {
      const res = await axios(`${process.env.API_URL}/news?populate=category`);
      const data = res.data;

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cannot get /news. Access denied',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'User',
    type: News,
  })
  async getById(@Param() params: { id: number }) {
    try {
      const res = await axios(
        `${process.env.API_URL}/news/${params.id}?populate=category`,
      );
      const data = res.data;

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cannot get /news/:id. Access denied',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post('')
  @ApiResponse({
    status: 200,
    description: 'User',
  })
  async add(@Body() body: CreateNewsDto) {
    try {
      const res = await axios.post(
        `${process.env.API_URL}/news`,
        { data: body },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return res.status;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cannot post /news. Access denied',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'Status',
  })
  async update(@Body() body: CreateNewsDto, @Param() params: { id: number }) {
    try {
      const res = await axios.put(
        `${process.env.API_URL}/news/${params.id}`,
        { data: body },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return res.status;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cannot update /news/:id. Access denied',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'Status',
  })
  async delete(@Param() params: { id: number }) {
    try {
      const res = await axios.delete(
        `${process.env.API_URL}/news/${params.id}`,
      );

      return res.status;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cannot delete /news/:id. Access denied',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
