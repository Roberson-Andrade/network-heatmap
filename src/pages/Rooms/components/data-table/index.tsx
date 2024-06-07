"use client";

import {
  ColumnDef,
  TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  options?: Partial<TableOptions<TData>>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  options,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    ...options,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border h-[45vh]">
      <Table className="table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.getValue() || cell.column.id === "actions"
                      ? flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="h-[calc(45vh_-_48px)]">
              <TableCell
                colSpan={columns.length}
                className="text-center font-semibold text-neutral-400 text-base"
              >
                Nenhum cômodo cadastrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
