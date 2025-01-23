import React, { CSSProperties, FC, ReactNode, useId } from 'react';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
  FilterFn,
  getFilteredRowModel,
  VisibilityState,
  getPaginationRowModel,
  PaginationState,
  TableMeta,
  Row,
  RowData,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
import { MdUnfoldMore, MdExpandMore, MdExpandLess, MdOutlineEast, MdOutlineWest } from 'react-icons/md';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Icon, Track } from 'components';
import Filter from './Filter';
import './DataTable.scss';
import { FetchNextPageOptions, InfiniteQueryObserverResult } from '@tanstack/react-query';

type DataTableProps = {
  data: any;
  columns: ColumnDef<any, any>[];
  tableBodyPrefix?: ReactNode;
  isClientSide?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: PaginationState;
  sorting?: SortingState;
  setPagination?: (state: PaginationState) => void;
  setSorting?: (state: SortingState) => void;
  globalFilter?: string;
  setGlobalFilter?: React.Dispatch<React.SetStateAction<string>>;
  columnVisibility?: VisibilityState;
  setColumnVisibility?: React.Dispatch<React.SetStateAction<VisibilityState>>;
  disableHead?: boolean;
  pagesCount?: number;
  meta?: TableMeta<any>;
  setSelectedRow?: (row: Row<any>) => void;
  pageSizeOptions?: number[];
  selectedRow?: (row: Row<any>) => boolean;
  isFetching?: boolean;
  fetchNextPage?: (options?: FetchNextPageOptions) => Promise<
    InfiniteQueryObserverResult<
      {
        response: unknown[];
      },
      unknown
    >
  >;
};

type ColumnMeta = {
  meta: {
    size: number | string;
    sticky: 'left' | 'right';
  };
};

type CustomColumnDef = ColumnDef<any> & ColumnMeta;

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }

  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    getRowStyles: (row: Row<TData>) => CSSProperties;
  }
  class Column<TData extends RowData> {
    columnDef: CustomColumnDef;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const DataTable: FC<DataTableProps> = ({
  data,
  columns,
  isClientSide = true,
  tableBodyPrefix,
  sortable,
  filterable,
  sorting,
  pagination,
  setPagination,
  setSorting,
  globalFilter,
  setGlobalFilter,
  columnVisibility,
  setColumnVisibility,
  disableHead,
  pagesCount,
  meta,
  setSelectedRow,
  pageSizeOptions = [10, 20, 30, 40, 50],
  selectedRow,
  isFetching,
  fetchNextPage,
}) => {
  const id = useId();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        // Once the user has scrolled within 500px of the bottom of the table
        if (scrollHeight - scrollTop - clientHeight < 500 && !isFetching && fetchNextPage) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching]
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      ...{ pagination },
    },
    meta,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: fuzzyFilter,
    onSortingChange: (updater) => {
      if (typeof updater !== 'function') return;
      setSorting?.(updater(table.getState().sorting));
    },
    onPaginationChange: (updater) => {
      if (typeof updater !== 'function') return;
      setPagination?.(updater(table.getState().pagination));
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(pagination && { getPaginationRowModel: getPaginationRowModel() }),
    ...(sortable && { getSortedRowModel: getSortedRowModel() }),
    manualPagination: !isClientSide,
    manualSorting: !isClientSide,
    pageCount: isClientSide ? undefined : pagesCount,
  });

  const getShownPageIndexes = () => {
    if (!table.getState().pagination) return [];

    const pageOffset = 2;
    const currentPage = table.getState().pagination.pageIndex;
    const startPage = Math.max(0, currentPage - pageOffset);
    const endPage = Math.min(table.getPageCount() - 1, currentPage + pageOffset);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  const pageIndexes = getShownPageIndexes();

  return (
    <>
      <div className="data-table__scrollWrapper" onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}>
        <table className="data-table">
          {!disableHead && (
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        width: header.column.columnDef.size,
                        position: header.column.columnDef.meta?.sticky ? 'sticky' : undefined,
                        left:
                          header.column.columnDef.meta?.sticky === 'left'
                            ? `${header.column.getAfter('left') * 0.675}px`
                            : undefined,
                        right:
                          header.column.columnDef.meta?.sticky === 'right'
                            ? `${header.column.getAfter('right') * 0.675}px`
                            : undefined,
                        backgroundColor: 'white',
                        zIndex: header.column.columnDef.meta?.sticky ? 1 : 0,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <Track gap={8}>
                          {sortable && header.column.getCanSort() && (
                            <button onClick={header.column.getToggleSortingHandler()}>
                              {{
                                asc: <Icon icon={<MdExpandMore fontSize={20} />} size="medium" />,
                                desc: <Icon icon={<MdExpandLess fontSize={20} />} size="medium" />,
                              }[header.column.getIsSorted() as string] ?? (
                                <Icon icon={<MdUnfoldMore fontSize={22} />} size="medium" />
                              )}
                            </button>
                          )}
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {filterable && header.column.getCanFilter() && (
                            <Filter column={header.column} table={table} />
                          )}
                        </Track>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          )}
          <tbody>
            {tableBodyPrefix}
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => setSelectedRow && setSelectedRow(row)}
                style={table.options.meta?.getRowStyles(row)}
                className={selectedRow?.(row) ? 'highlighted' : 'default'}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      position: cell.column.columnDef.meta?.sticky ? 'sticky' : undefined,
                      left:
                        cell.column.columnDef.meta?.sticky === 'left'
                          ? `${cell.column.getAfter('left') * 0.675}px`
                          : undefined,
                      right:
                        cell.column.columnDef.meta?.sticky === 'right'
                          ? `${cell.column.getAfter('right') * 0.675}px`
                          : undefined,
                      zIndex: cell.column.columnDef.meta?.sticky ? 1 : 0,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="data-table__pagination-wrapper">
          {table.getPageCount() * table.getState().pagination.pageSize > table.getState().pagination.pageSize && (
            <div className="data-table__pagination">
              <button
                className="previous"
                onClick={() => {
                  table.previousPage();
                  setSearchParams((params) => {
                    params.set('page', String(Number(searchParams.get('page') ?? '1') - 1));
                    return params;
                  });
                }}
                disabled={!table.getCanPreviousPage()}
              >
                <MdOutlineWest />
              </button>
              <nav role="navigation" aria-label={t('global.paginationNavigation') || ''}>
                <ul className="links">
                  {pageIndexes[0] > 0 && (
                    <>
                      <li key={`${id}-0`}>
                        <button
                          onClick={() => {
                            table.setPageIndex(0);
                            setSearchParams((params) => {
                              params.set('page', '1');
                              return params;
                            });
                          }}
                          aria-label={t('global.gotoPage') + 0}
                          aria-current={table.getState().pagination.pageIndex === 0}
                        >
                          1
                        </button>
                      </li>
                      {pageIndexes[0] > 1 && <li>...</li>}
                    </>
                  )}
                  {pageIndexes.map((index) => (
                    <li
                      key={`${id}-${index}`}
                      className={clsx({ active: table.getState().pagination.pageIndex === index })}
                    >
                      <button
                        onClick={() => {
                          table.setPageIndex(index);
                          setSearchParams((params) => {
                            params.set('page', String(index + 1));
                            return params;
                          });
                        }}
                        aria-label={t('global.gotoPage') + index}
                        aria-current={table.getState().pagination.pageIndex === index}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  {pageIndexes[pageIndexes.length - 1] < table.getPageCount() - 1 && (
                    <>
                      {pageIndexes[pageIndexes.length - 1] < table.getPageCount() - 2 && <li>...</li>}
                      <li key={`${id}-${table.getPageCount() - 1}`}>
                        <button
                          onClick={() => {
                            table.setPageIndex(table.getPageCount() - 1);
                            setSearchParams((params) => {
                              params.set('page', '' + table.getPageCount());
                              return params;
                            });
                          }}
                          aria-label={t('global.gotoPage') + (table.getPageCount() - 1)}
                          aria-current={table.getState().pagination.pageIndex === table.getPageCount() - 1}
                        >
                          {table.getPageCount()}
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
              <button
                className="next"
                onClick={() => {
                  table.nextPage();
                  setSearchParams((params) => {
                    params.set('page', String(Number(searchParams.get('page') ?? '1') + 1));
                    return params;
                  });
                }}
                disabled={!table.getCanNextPage()}
              >
                <MdOutlineEast />
              </button>
            </div>
          )}
          <div className="data-table__page-size">
            <label htmlFor={id}>{t('global.resultCount')}</label>
            <select
              id={id}
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;
