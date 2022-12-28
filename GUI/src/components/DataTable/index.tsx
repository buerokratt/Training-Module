import { FC, ReactNode, useState } from 'react';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState, FilterFn, getFilteredRowModel,
} from '@tanstack/react-table';
import {
  RankingInfo,
  rankItem,
} from '@tanstack/match-sorter-utils';
import { MdUnfoldMore, MdExpandMore, MdExpandLess } from 'react-icons/md';

import { Icon, Track } from 'components';
import './DataTable.scss';

type DataTableProps = {
  data: any;
  columns: ColumnDef<any, any>[];
  tableBodyPrefix?: ReactNode;
  sortable?: boolean;
  globalFilter?: string;
  setGlobalFilter?: React.Dispatch<React.SetStateAction<string>>;
  disableHead?: boolean;
}

type ColumnMeta = {
  meta: {
    size: number | string;
  }
}

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }

  interface FilterMeta {
    itemRank: RankingInfo;
  }
}


type CustomColumnDef = ColumnDef<any> & ColumnMeta;

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const DataTable: FC<DataTableProps> = (
  {
    data,
    columns,
    tableBodyPrefix,
    sortable,
    globalFilter,
    setGlobalFilter,
    disableHead,
  },
) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(sortable && { getSortedRowModel: getSortedRowModel() }),
  });

  return (
    <table className='data-table'>
      {!disableHead && (
        <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} style={{ width: (header.column.columnDef as CustomColumnDef).meta?.size }}>
                {header.isPlaceholder ? null : (
                  <Track gap={8} onClick={header.column.getToggleSortingHandler()}>
                    {sortable && header.column.getCanSort() && (
                      <>
                        {{
                          asc: <Icon icon={<MdExpandMore fontSize={20} />} size='medium' />,
                          desc: <Icon icon={<MdExpandLess fontSize={20} />} size='medium' />,
                        }[header.column.getIsSorted() as string] ?? (
                          <Icon icon={<MdUnfoldMore fontSize={22} />} size='medium' />
                        )}
                      </>
                    )}
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
          ))}
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default DataTable;
