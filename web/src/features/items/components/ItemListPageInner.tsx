"use client";

import { PageShell } from "@/components/layouts";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-client";
import { useDialog, useDialogActions } from "@/stores/dialog";
import { Item } from "@/types/api/item";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useDeleteItem } from "../api/delete-item";
import { useGetItems } from "../api/get-items";
import { ItemLists } from "../components";
import {
  CreateItemDialog,
  DeleteItemAlert,
  EditItemDialog,
} from "../components/dialogs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export const ItemListPageInner = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce({
    value: search,
  });

  const { data, isPending } = useGetItems({
    params: {
      search: debouncedSearch,
    },
  });

  const { mutate: deleteItem } = useDeleteItem({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Item berhasil dihapus");
        closeDialog();
      },
      onError: (err) => {
        const message = getApiErrorMessage(err);

        toast.error(message);
      },
    },
  });

  const { data: dialogData } = useDialog<Item>();
  const { openDialog, closeDialog } = useDialogActions();

  const onCreateClick = () => {
    openDialog("create", null);
  };

  const onDeleteConfirm = () => {
    deleteItem(dialogData?.id);
  };

  return (
    <PageShell title="Layanan & Item">
      <div className="container mx-auto space-y-6 px-4 py-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-4">
            <PageHeader>
              <PageHeaderHeading>Layanan & Item</PageHeaderHeading>
              <PageHeaderDescription>
                Daftar layanan & item yang tersedia
              </PageHeaderDescription>
            </PageHeader>

            <Button onClick={onCreateClick}>
              <Plus />
              <span>Tambah Item</span>
            </Button>
          </div>

          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari item"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>

        <ItemLists data={data ?? []} isLoading={isPending} />
      </div>

      {/* Dialogs */}
      <CreateItemDialog />
      <DeleteItemAlert onConfirm={onDeleteConfirm} />
      <EditItemDialog />
    </PageShell>
  );
};
