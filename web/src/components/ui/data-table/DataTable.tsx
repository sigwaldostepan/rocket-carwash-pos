import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { DataTablePagination } from "./DataTablePagination";
import { Skeleton } from "../skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import {
  DEFAULT_PAGINATION_LIMIT,
  PAGINATION_LIMIT_OPTIONS,
} from "@/constants/pagination";

type DataTableProps<TData> = {
  table: TanstackTable<TData>;
  entityName: string;
  isLoading: boolean;
  skeletonRows?: number;
  withPagination?: boolean;
  showNextPrev?: boolean;
};

export const DataTable = <TData,>({
  table,
  entityName,
  isLoading,
  skeletonRows = 5,
  withPagination,
  showNextPrev,
}: DataTableProps<TData>) => {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
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
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: table.getAllColumns().length }).map(
                    (_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {entityName} masih kosong.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!!withPagination && (
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-2">
            <p className="text-muted-foreground text-sm">Data per halaman</p>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder={DEFAULT_PAGINATION_LIMIT} />
              </SelectTrigger>
              <SelectContent>
                {PAGINATION_LIMIT_OPTIONS.map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DataTablePagination
            table={table}
            showNextPrev={showNextPrev}
            className="justify-end"
          />
        </div>
      )}
    </div>
  );
};
