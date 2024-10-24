import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsString } from 'class-validator';
import { Filters, Pagination } from 'src/dto-classes';

export class NewsQuery {
  @IsBoolean()
  @ApiProperty({
    required: false,
    type: Boolean,
    description:
      'Include categories in the response if set to true. If false or omitted, categories will not be included.',
  })
  includeCategories?: boolean;

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
