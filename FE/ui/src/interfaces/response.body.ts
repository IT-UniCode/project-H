import type { Pagination } from "./pagination";

export interface ResponseBody<
  B,
  M = {
    pagination: Pagination;
  },
> {
  data: B[];
  meta: M;
}
