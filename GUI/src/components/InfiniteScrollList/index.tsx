import Track from 'components/Track';
import { useInfinitePagination } from 'hooks/useInfinitePagination';
import { ReactNode, useMemo, useRef, useCallback } from 'react';
import { flattenPaginatedData } from 'utils/api-utils';

export interface InfiniteScrollListProps<T> {
  queryKey: string[];
  fetchFn: (params: any) => Promise<any>;
  filter?: string;
  renderItem: (item: T, ref?: (element: HTMLElement | null) => void) => ReactNode;
  className?: string;
}

function InfiniteScrollList<T>({ queryKey, fetchFn, filter = '', renderItem, className }: InfiniteScrollListProps<T>) {
  const { data, fetchNextPage, isFetching, isLoading, hasNextPage } = useInfinitePagination<T>({
    queryKey,
    fetchFn,
    filter,
  });

  const items = useMemo(() => flattenPaginatedData(data), [data]);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElement = useCallback(
    (element: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (element) observer.current.observe(element);
    },
    [isLoading, hasNextPage, isFetching, fetchNextPage]
  );

  return (
    <Track direction="vertical" align="stretch" gap={4} className={className}>
      {/* todo maybe null and not undefined */}
      {items.map((item, index) => renderItem(item, index === items.length - 1 ? lastElement : undefined))}
    </Track>
  );
}

export default InfiniteScrollList;
