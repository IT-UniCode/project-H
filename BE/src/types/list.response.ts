import { ApiProperty } from '@nestjs/swagger';
import { MetaPagination } from './meta.pagination';

export class ListResponse<D, M = MetaPagination> {
  data: D[];
  meta: M;
}
