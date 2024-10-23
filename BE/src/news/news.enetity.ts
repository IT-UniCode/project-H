import { ApiProperty } from '@nestjs/swagger';

export class News {
  @ApiProperty({ example: 'Some Title', description: 'Title of new' })
  title: string;

  @ApiProperty({
    example: 'Some text',
    description: 'Content can be string or markdown',
  })
  content: {};

  @ApiProperty({
    example: '[1, 3, 5, 6]',
    description: 'Categories of new (array of categories id)',
  })
  categories: number[];
}
