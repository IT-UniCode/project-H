import { ApiProperty } from '@nestjs/swagger';
import { News } from 'src/news/dto/news.dto';
import { Entity } from 'src/dto-classes';

export class Category extends Entity {
  @ApiProperty({ example: 'Some Name', description: 'Name of the category' })
  name: string;

  @ApiProperty({ example: 'some-name', description: 'Slug of the category' })
  slug: string;
}

export class CategoryWithNews extends Category {
  @ApiProperty({
    description: 'List of this category news',
    type: [News],
  })
  news: News[];
}
