import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Filters, PaginationQuery } from 'src/types';

export class FundraisingQuery extends IntersectionType(
  PaginationQuery,
  Filters,
) {
  @ApiProperty({
    required: false,
    type: Boolean,
    description:
      'Include categories in the response if set to true. If false or omitted, categories will not be included.',
  })
  includeCategories: boolean;
}
