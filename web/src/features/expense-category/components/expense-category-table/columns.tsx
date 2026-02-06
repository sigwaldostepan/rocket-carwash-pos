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
import { ExpenseCategoryWithExpenseCount } from "@/types/api/expense";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";

export const expenseCategoryColumns: ColumnDef<ExpenseCategoryWithExpenseCount>[] =
  [
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
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "description",
      header: "Deskripsi",
    },
    {
      accessorKey: "expenseCount",
      header: "Jumlah Transaksi",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.expenseCount} transaksi</Badge>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const { openDialog } = useDialog();

        const onEditClick = () => {
          openDialog(DIALOG_KEY.expenseCategory.edit, row.original);
        };

        const onDeleteClick = () => {
          openDialog(DIALOG_KEY.expenseCategory.delete, row.original);
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
