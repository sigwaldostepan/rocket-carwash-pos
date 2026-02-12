"use client";

import { Container, PageShell } from "@/components/layouts";
import { PageHeader, PageHeaderHeading } from "@/components/shared";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useGetItems } from "@/features/items/api/get-items";
import { useDebounce } from "@/hooks/use-debounce";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { TransactionWithCustomer } from "@/types/api/transaction";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  ApplyRedeemPointDialog,
  TransactionCartSheet,
  TransactionCartSidebar,
  TransactionItemGrid,
} from "../components";

export const CreateTransactionPageInner = () => {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce({ value: search });

  const { data, isPending } = useGetItems({
    params: {
      search: debouncedSearch,
    },
  });

  // dialog stores for ApplyRedeemPointDialog
  const { isOpen, key, setIsOpen } = useDialog<TransactionWithCustomer>();

  return (
    <PageShell title="Buat Transaksi">
      <Container className="flex gap-6">
        <section className="flex-1 space-y-6">
          <div className="space-y-4">
            <PageHeader>
              <PageHeaderHeading>Buat Transaksi</PageHeaderHeading>
            </PageHeader>

            <InputGroup>
              <InputGroupInput
                placeholder="Cari item"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <TransactionItemGrid isLoading={isPending} items={data ?? []} />
        </section>

        <TransactionCartSidebar className="sticky top-24 right-0 shrink-0 md:w-72" />
      </Container>

      {/* dialogs */}
      <ApplyRedeemPointDialog
        open={isOpen && key === DIALOG_KEY.transaction.redeemPoint}
        onOpenChange={(open) =>
          setIsOpen(DIALOG_KEY.transaction.redeemPoint, open)
        }
      />
      <TransactionCartSheet />
    </PageShell>
  );
};
