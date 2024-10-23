import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsObject,
  IsString,
} from 'class-validator';

class Filters {
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

class Pagination {
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

export class CategoriesQuery {
  @IsBoolean()
  @ApiProperty({
    required: false,
    type: Boolean,
    description:
      'Include news in the response if set to true. If false or omitted, categories will not be included.',
  })
  includeNews?: boolean;

  @IsObject()
  @IsString()
  @ApiProperty({
    type: Pagination || 'max',
    name: 'Pagination',
    required: false,
    description:
      'If set to "max", returns all the data without pagination. Overrides page and pageSize parameters.',
    example: 'max',
  })
  pagination?: Pagination | 'max';

  @IsObject()
  @ApiProperty({
    type: Filters,
    name: 'Filters',
    required: false,
  })
  filters?: Filters;
}
