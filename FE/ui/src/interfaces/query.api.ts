export interface QueryApi {
  pagination?: { page?: number; pageSize?: number } | "max";
  filters?: {
    field: string;
    value: string | number;
  };
  [key: string]: any;
}
