"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogActions } from "@/stores/dialog";
import { CustomerWithTransactionCount } from "@/types/api/customer";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Gift, MoreVertical, Trash2 } from "lucide-react";

export const customerColumn: ColumnDef<CustomerWithTransactionCount>[] = [
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
    cell: ({ row }) => {
      const name = row.original.name;

      return <p className="font-bold">{name}</p>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Nomor Telepon",
  },
  {
    accessorKey: "point",
    header: "Poin",
    cell: ({ row }) => {
      const point = row.original.point;
      return (
        <div className="flex items-center space-x-2">
          <Gift className="text-blue-600" size={16} />
          <p className="font-bold">{point}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "transactionCount",
    header: "Jumlah Transaksi",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { openDialog } = useDialogActions();

      const onEditClick = () => {
        console.log(row.original);
        openDialog("edit", row.original);
      };

      const onDeleteClick = () => {
        openDialog("delete", row.original);
      };

      return (
        <div className="flex w-full items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onEditClick}>
                <Edit /> Edit
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
