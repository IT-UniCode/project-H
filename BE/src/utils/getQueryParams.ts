export function getQueryParams(
  query: {
    page: string;
    pageSize: string;
    field: string;
    value: string | number;
  },
  filterType: string = '',
) {
  const pagination =
    query.pageSize === '-1'
      ? 'pagination[limit]=max&'
      : `pagination[page]=${query.page || 1}&pagination[pageSize]=${query.pageSize || 25}&`;

  const filters = query.value
    ? `filters${filterType && `[${filterType}]`}[${query.field || 'documentId'}]=${query.value}&`
    : '';

  return pagination + filters;
}
