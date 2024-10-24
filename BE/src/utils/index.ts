export function getQueryParams(
  query: {
    page: number;
    pageSize: string;
    field: string;
    value: string | number;
  },
  filterType: string = '',
) {
  const pagination =
    query.pageSize === 'max'
      ? 'pagination[limit]=max&'
      : `pagination[page]=${query.page || 0}&pagination[pageSize]=${parseInt(query.pageSize) || 25}&`;

  const filters = query.value
    ? `filters${filterType && `[${filterType}]`}[${query.field || 'documentId'}]=${query.value}&`
    : '';

  return pagination + filters;
}
