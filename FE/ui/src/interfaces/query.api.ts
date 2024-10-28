export interface QueryApi {
  page?: number;
  pageSize?: number;
  field?: string;
  value?: string | number;
  [key: string]: any;
}
