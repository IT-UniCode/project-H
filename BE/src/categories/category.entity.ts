import { ApiProperty } from '@nestjs/swagger';
import { News } from 'src/news/news.enetity';

export class Category {
  @ApiProperty({ example: 'Some Name', description: 'Name of the category' })
  name: string;

  @ApiProperty({
    example:
      '{id: 1, title: "Some title", description: "Some Description", categories: [2, 3]}',
    description: 'List of this category news',
  })
  data: News[];
}
