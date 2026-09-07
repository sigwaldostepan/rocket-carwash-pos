"use client";

import { Container } from "@/components/layouts";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FileText, Trash2, User2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteDraft } from "../api/delete-draft";
import { useGetDrafts } from "../api/get-drafts";
import { useLoadDraft } from "../hooks/use-load-draft";
import { DraftWithCustomer } from "../types";
import { DeleteDraftAlert } from "./dialogs/DeleteDraftAlert";

export const DraftListPageInner = () => {
  const { data: drafts, isPending } = useGetDrafts();

  const { openDialog, setIsOpen, data: dialogData } = useDialog<DraftWithCustomer>();
  const { load } = useLoadDraft();

  const { mutate: deleteDraft } = useDeleteDraft({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Draft berhasil dihapus");
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error));
      },
    },
  });

  const onConfirmDelete = () => {
    deleteDraft(dialogData.id);
    setIsOpen(DIALOG_KEY.draft.delete, false);
  };

  return (
    <Container>
        <div className="space-y-4">
          <PageHeader>
            <PageHeaderHeading>Draft Transaksi</PageHeaderHeading>
            <PageHeaderDescription>
              Draft yang belum diproses pembayarannya
            </PageHeaderDescription>
          </PageHeader>

          {isPending ? (
            <div className="text-muted-foreground text-sm">Memuat draft...</div>
          ) : !drafts || drafts.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              Belum ada draft.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {drafts.map((draft) => (
                <Card key={draft.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User2 className="size-4" />
                    {draft.customer?.name ?? "Tanpa customer"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="text-muted-foreground">
                    {draft.detail.reduce(
                      (total, d) => total + (d.item ? d.quantity : 0),
                      0,
                    )}{" "}
                    item
                  </div>
                  <div className="text-muted-foreground">
                    {format(new Date(draft.createdAt), "dd MMM yyyy, HH:mm", {
                      locale: id,
                    })}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => load(draft)}
                    >
                      <FileText />
                      Proses pembayaran
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() =>
                        openDialog(DIALOG_KEY.draft.delete, draft)
                      }
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DeleteDraftAlert onConfirm={onConfirmDelete} />
      </Container>
  );
};