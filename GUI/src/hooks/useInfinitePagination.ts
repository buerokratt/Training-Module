import { useInfiniteQuery } from '@tanstack/react-query';
import { PaginationParams } from 'types/api';

interface UseInfinitePaginationProps<T> {
  queryKey: string[];
  fetchFn: (params: PaginationParams) => Promise<{ response: T[]; totalCount?: number }>;
  pageSize?: number;
  filter?: string;
}

export function useInfinitePagination<T>({
  queryKey,
  fetchFn,
  pageSize = 10,
  filter = '',
}: UseInfinitePaginationProps<T>) {
  return useInfiniteQuery<{ response: T[]; totalCount?: number }>({
    queryKey: [...queryKey, filter],
    queryFn: ({ pageParam = 0 }) => fetchFn({ pageParam, pageSize, filter }),
    // todo temp ?
    getNextPageParam: (lastPage, pages) => (lastPage?.response?.length === 0 ? undefined : pages.length * pageSize),
  });
}
