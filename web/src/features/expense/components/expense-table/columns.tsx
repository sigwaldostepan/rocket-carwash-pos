"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { ExpenseWithCategory } from "@/types/api/expense";
import { formatRupiah } from "@/utils/currency";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";

export const expenseColumns: ColumnDef<ExpenseWithCategory>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Pilih semua"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Pilih baris"
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return format(date, "dd MMM yyyy", { locale: id });
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => row.original.description || "-",
  },
  {
    accessorKey: "expenseCategory.name",
    header: "Kategori",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.expenseCategory?.name}</Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Jumlah",
    cell: ({ row }) => (
      <span className="text-destructive font-medium">
        {formatRupiah(row.original.amount)}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { openDialog } = useDialog();

      const onEditClick = () => {
        openDialog(DIALOG_KEY.expense.edit, row.original);
      };

      const onDeleteClick = () => {
        openDialog(DIALOG_KEY.expense.delete, row.original);
      };

      return (
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditClick}>
                <Edit2 /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDeleteClick}>
                <Trash2 /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
