export function getQueryParams(query: {
  page: number;
  pageSize: string;
  field: string;
  value: string | number;
}) {
  const pagination =
    query.pageSize === 'max'
      ? 'pagination[limit]=max&'
      : `pagination[page]=${query.page || 0}&pagination[pageSize]=${parseInt(query.pageSize) || 25}&`;

  const filters =
    query.field && query.value
      ? `filters[news][${query.field || 'documentId'}]=${query.value}&`
      : '';

  return pagination + filters;
}
