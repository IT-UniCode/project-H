import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/category.entity';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

export class News {
  @ApiProperty({ example: 'Some Title', description: 'Title of new' })
  title: string;

  @ApiProperty({
    example: 'Some text',
    description: 'Content can be string or markdown',
  })
  content: string;

  @ApiProperty({
    description: 'Categories of new (array of categories id)',
    example: {
      id: 3,
      documentId: 'o6x0w7j2hh81slkks66p6gus',
      title: '1',
      content: '1',
      createdAt: '2024-10-22T13:17:13.637Z',
      updatedAt: '2024-10-22T13:19:21.163Z',
      publishedAt: '2024-10-22T13:19:21.178Z',
    },
  })
  categories: {};
}
