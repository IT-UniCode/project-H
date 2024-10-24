import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsString } from 'class-validator';
import { Filters, Pagination } from 'src/dto-classes';

export class NewsQuery extends IntersectionType(Pagination, Filters) {
  @IsBoolean()
  @ApiProperty({
    required: false,
    type: Boolean,
    description:
      'Include categories in the response if set to true. If false or omitted, categories will not be included.',
  })
  includeCategories?: boolean;
}
