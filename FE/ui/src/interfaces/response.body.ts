export interface ResponseBody<B, M = {}> {
  data: B[];
  meta?: M;
}
