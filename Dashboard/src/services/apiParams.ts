import type { PaginationQuery } from '../types/admin';

export const buildPaginationParams = (query: PaginationQuery) => {
  const params = new URLSearchParams({
    pageNum: query.pageNum.toString(),
    pageSize: query.pageSize.toString(),
  });

  if (query.term) params.append('term', query.term);
  if (query.startDate) params.append('startDate', query.startDate);
  if (query.endDate) params.append('endDate', query.endDate);

  return params;
};
