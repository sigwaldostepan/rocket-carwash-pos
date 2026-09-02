"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGetDrafts } from "@/features/draft/api/get-drafts";
import { DraftWithCustomer } from "@/features/draft/types";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useDisclosure } from "@/hooks/use-disclosure";
import { Loader2, Trash2, FileDown, User2 } from "lucide-react";
import { useState } from "react";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";

type DraftSelectDialogProps = {
  onLoadDraft: (draft: DraftWithCustomer) => void;
};

export const DraftSelectDialog = ({
  onLoadDraft,
}: DraftSelectDialogProps) => {
  const [search, setSearch] = useState("");
  const { data: drafts, isPending } = useGetDrafts();
  const { openDialog } = useDialog();
  const { isOpen, open, close, toggle } = useDisclosure();

  const draftCount = drafts?.length ?? 0;

  const filtered = (drafts ?? []).filter(
    (d) =>
      d.customer?.name.toLowerCase().includes(search.toLowerCase()) ?? true,
  );

  const handleSelect = (draft: DraftWithCustomer) => {
    onLoadDraft(draft);
    close();
  };

  const handleDelete = (e: React.MouseEvent, draft: DraftWithCustomer) => {
    e.preventDefault();
    e.stopPropagation();
    openDialog(DIALOG_KEY.draft.delete, draft);
  };

  return (
    <div>
      <span className="text-muted-foreground text-xs">Draft:</span>
      <Button className="mt-1 w-full" variant="outline" onClick={toggle}>
        <FileDown />
        Muat draft{draftCount > 0 ? ` (${draftCount})` : ""}
      </Button>

      <CommandDialog
        open={isOpen}
        onOpenChange={(next) => (next ? open() : close())}
        title="Muat Draft"
        description="Pilih draft untuk dimuat"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari draft..."
            value={search}
            onValueChange={setSearch}
          />
          {isPending ? (
            <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memuat draft...
            </div>
          ) : filtered.length === 0 ? (
            <CommandEmpty>Belum ada draft</CommandEmpty>
          ) : (
            <CommandList>
              <CommandGroup>
                {filtered.map((draft) => (
                  <CommandItem
                    key={draft.id}
                    value={draft.id}
                    onSelect={() => handleSelect(draft)}
                  >
                    <User2 />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {draft.customer?.name ?? "Tanpa customer"}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {draft.detail.reduce(
                          (total, d) => total + (d.item ? d.quantity : 0),
                          0,
                        )}{" "}
                        item &middot;{" "}
                        {formatDistanceToNow(new Date(draft.createdAt), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-destructive flex h-7 w-7 shrink-0 items-center justify-center rounded-sm hover:bg-destructive/10"
                      onClick={(e) => handleDelete(e, draft)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </CommandDialog>
    </div>
  );
};
