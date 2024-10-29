import { MetaPagination } from '.';

export class ListResponse<D, M = MetaPagination> {
  data: D[];
  meta: M;
}
