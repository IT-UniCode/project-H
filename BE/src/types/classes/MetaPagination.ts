import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from './PaginationMeta';

export class MetaPagination {
  @ApiProperty({
    description: 'Pagination info',
    type: PaginationMeta,
  })
  pagination: PaginationMeta;
}
