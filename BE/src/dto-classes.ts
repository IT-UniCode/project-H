import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class Entity {
  @ApiProperty({
    description: 'Unique id of entity (changes after updating)',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Unique id of entity (never changes)',
    type: String,
  })
  documentId: string;

  @ApiProperty({
    description: 'Date as string',
    example: '2024-10-22T13:40:49.782Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date as string',
    example: '2024-10-22T13:40:49.782Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Date as string',
    example: '2024-10-22T13:40:49.782Z',
  })
  publishedAt: string;
}

export class Filters {
  @IsString()
  @ApiProperty({
    name: 'filters[field]',
    required: false,
    type: String,
    description:
      'The name of the field to filter data by (e.g., "title", "category").',
    example: 'title',
  })
  field: string;

  @IsNumberString()
  @ApiProperty({
    name: 'filters[value]',
    required: false,
    type: String,
    description:
      'The value the specified filter field must match (e.g., "JS", "Sport", "Politics" or a numerical value).',
    example: 'Some title',
  })
  value: string | number;
}

export class Pagination {
  @IsNumber()
  @ApiProperty({
    name: 'pagination[pageSize]',
    required: false,
    type: Number,
    description: 'Specify the number of items per page. Default is 25.',
    example: 25,
  })
  pageSize: number;

  @IsNumber()
  @ApiProperty({
    name: 'pagination[page]',
    required: false,
    type: Number,
    description: 'Specify the page number to retrieve. Default is 1.',
    example: 1,
  })
  page: number;
}
