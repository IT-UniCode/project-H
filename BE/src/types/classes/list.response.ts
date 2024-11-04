import { MetaPagination } from './MetaPagination';

export class ListResponse<D, M = MetaPagination> {
  data: D[];
  meta: M;
}
