export interface QueryApi {
  page?: number;
  pageSize?: number | "max";
  field?: string;
  value?: string | number;
  [key: string]: any;
}
