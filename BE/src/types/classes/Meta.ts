import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from './PaginationMeta';

export class Meta {
  @ApiProperty({
    description: 'Pagination info',
    type: PaginationMeta,
  })
  pagination: PaginationMeta;
}
