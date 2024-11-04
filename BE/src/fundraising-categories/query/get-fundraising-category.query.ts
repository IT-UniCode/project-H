import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { Filters, PaginationQuery } from 'src/types';

export class GetFundraisingCategoryQuery extends IntersectionType(
  PaginationQuery,
  Filters,
) {
  @IsBoolean()
  @ApiProperty({
    required: false,
    type: Boolean,
    description:
      'Include fundraisings in the response if set to true. If false or omitted, fundraisings will not be included.',
  })
  includeFundraisings?: boolean;
}
