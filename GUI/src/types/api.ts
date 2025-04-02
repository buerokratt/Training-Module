export interface PaginationParams {
  pageParam: number;
  pageSize: number;
  filter: string;
}

export interface PaginatedResponse<T> {
  response: T[];
  totalCount?: number;
}
