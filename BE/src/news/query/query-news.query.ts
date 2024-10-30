import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { Filters, PaginationQuery } from 'src/types';

export class NewsQuery extends IntersectionType(PaginationQuery, Filters) {
  @IsBoolean()
  @ApiProperty({
    required: false,
    type: Boolean,
    description:
      'Include categories in the response if set to true. If false or omitted, categories will not be included.',
  })
  includeCategories?: boolean;
}
