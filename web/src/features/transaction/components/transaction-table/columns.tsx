"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { TransactionWithCustomer } from "@/types/api/transaction";
import { formatRupiah } from "@/utils/currency";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MoreVertical, Trash2 } from "lucide-react";

export const transactionColumns: ColumnDef<TransactionWithCustomer>[] = [
  {
    accessorKey: "invoiceNo",
    header: "No. Invoice",
  },
  {
    accessorKey: "customer.name",
    header: "Nama",
    cell: ({ row }) => (
      <div className="min-w-[100px]">{row.original.customer?.name ?? ""}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const value = row.original.createdAt;

      return format(value, "dd MMM yyyy", { locale: id });
    },
  },
  {
    accessorKey: "time",
    header: "Waktu",
    cell: ({ row }) => {
      const value = row.original.createdAt;

      return format(value, "HH:mm:ss", { locale: id });
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Metode Pembayaran",
  },
  {
    accessorKey: "isCompliment",
    header: () => <div className="text-center">Dikomplimen</div>,
    cell: ({ row }) => {
      const value = row.original.isCompliment;

      return (
        <div className="flex items-center justify-center">
          <Checkbox checked={!!value} />
        </div>
      );
    },
  },
  {
    accessorKey: "isNightShift",
    header: () => <div className="text-center">Shift Malam</div>,
    cell: ({ row }) => {
      const value = row.original.isNightShift;

      return (
        <div className="flex items-center justify-center">
          <Checkbox checked={!!value} />
        </div>
      );
    },
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => {
      const value = row.original.subtotal;

      return formatRupiah(Number(value));
    },
  },
  {
    accessorKey: "complimentValue",
    header: "Potongan",
    cell: ({ row }) => {
      const value = row.original.complimentValue;

      return formatRupiah(Number(value));
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const value = row.original.total;

      return <span className="font-bold">{formatRupiah(Number(value))}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { openDialog } = useDialog();

      const onDeleteClick = () => {
        openDialog(DIALOG_KEY.transaction.delete, row.original);
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
