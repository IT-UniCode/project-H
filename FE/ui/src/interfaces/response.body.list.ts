import type { Pagination } from "./pagination";

export interface ResponseBodyList<
  B,
  M = {
    pagination: Pagination;
  },
> {
  data: B[];
  meta: M;
}

export interface ResponseBody<
  B,
  M = {
    pagination: Pagination;
  },
> {
  data: B;
  meta: M;
}
