import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/category.entity';
import { Entity } from 'src/dto-classes';

export class News extends Entity {
  @ApiProperty({ example: 'Some Title', description: 'Title of new' })
  title: string;

  @ApiProperty({
    example: 'Some text',
    description: 'Content can be string or markdown',
  })
  content: string;

  @ApiProperty({
    example: 'Some preview text',
    description: 'Content can be string or markdown',
  })
  previewText: string;

  @ApiProperty({ example: 'some-name', description: 'Slug of the new' })
  slug: string;
}

export class NewsWithCategories extends News {
  @ApiProperty({
    description: 'Categories of new',
    type: Category,
  })
  category: Category;
}
