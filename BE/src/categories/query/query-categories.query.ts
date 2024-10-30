import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { Filters, PaginationQuery } from 'src/types';

export class CategoriesQuery extends IntersectionType(
  PaginationQuery,
  Filters,
) {
  @IsBoolean()
  @ApiProperty({
    required: false,
    type: Boolean,
    description:
      'Include news in the response if set to true. If false or omitted, categories will not be included.',
  })
  includeNews?: boolean;

  @ApiProperty({
    example: 'name',
  })
  field: string;
}
