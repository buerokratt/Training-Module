import { FC, ReactNode } from 'react';
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

import './DataTable.scss';

type DataTableProps = {
  data: any;
  columns: ColumnDef<any, any>[];
  tableBodyPrefix?: ReactNode;
}

type ColumnMeta = {
  meta: {
    size: number | string;
  }
}

type CustomColumnDef = ColumnDef<any> & ColumnMeta;

const DataTable: FC<DataTableProps> = ({ data, columns, tableBodyPrefix }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className='data-table'>
      <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id} style={{ width: (header.column.columnDef as CustomColumnDef).meta?.size }}>
              {header.isPlaceholder ? null : (
                flexRender(header.column.columnDef.header, header.getContext())
              )}
            </th>
          ))}
        </tr>
      ))}
      </thead>
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
