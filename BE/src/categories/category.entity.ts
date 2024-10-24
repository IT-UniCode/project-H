import { ApiProperty } from '@nestjs/swagger';
import { News } from 'src/news/news.enetity';
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
    example: [
      {
        id: 1,
        title: 'Some Title',
        content: 'Some text',
        slug: 'some-name',
        createdAt: '2024-10-22T13:40:49.782Z',
        updatedAt: '2024-10-22T13:40:49.782Z',
        publishedAt: '2024-10-22T13:40:49.782Z',
      },
    ],
  })
  news: News[];
}
