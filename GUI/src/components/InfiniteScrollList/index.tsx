import Track from 'components/Track';
import { useInfinitePagination } from 'hooks/useInfinitePagination';
import { ReactNode, useMemo, useRef, useCallback } from 'react';
import { flattenPaginatedData } from 'utils/api-utils';
import Collapsible from 'components/Collapsible';

export interface InfiniteScrollListProps<T> {
  queryKey: string[];
  fetchFn: (params: any) => Promise<any>;
  filter?: string;
  title: string;
  defaultOpen?: boolean;
  renderItem: (item: T, ref?: (element: HTMLElement | null) => void) => ReactNode;
}

function InfiniteScrollList<T>({
  queryKey,
  fetchFn,
  filter = '',
  title,
  defaultOpen,
  renderItem,
}: InfiniteScrollListProps<T>) {
  const { data, fetchNextPage, isFetching, isLoading, hasNextPage } = useInfinitePagination<T>({
    queryKey,
    fetchFn,
    filter,
  });

  const items = useMemo(() => flattenPaginatedData(data), [data]);
  const totalCount = data?.pages[0]?.totalCount ?? 0;
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
    <Collapsible title={`${title} (${totalCount})`} defaultOpen={defaultOpen}>
      <Track direction="vertical" align="stretch" gap={4}>
        {items.map((item, index) => renderItem(item, index === items.length - 1 ? lastElement : undefined))}
      </Track>
    </Collapsible>
  );
}

export default InfiniteScrollList;
