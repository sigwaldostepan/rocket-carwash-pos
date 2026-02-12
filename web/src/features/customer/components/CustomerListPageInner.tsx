"use client";

import { Container, PageShell } from "@/components/layouts";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/use-debounce";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { CustomerWithTransactionCount } from "@/types/api/customer";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteCustomer } from "../api/delete-customer";
import { useGetCustomers } from "../api/get-customers";
import { CustomerTable } from "./customer-table";
import {
  CreateCustomerDialog,
  DeleteCustomerAlert,
  EditCustomerDialog,
} from "./dialogs";

export const CustomerListPageInner = () => {
  // query params
  const { page, limit } = usePaginationQuery();
  const [search, setSearch] = useState("");
  const debouncedInput = useDebounce({ value: search });

  const { data, isPending: isLoading } = useGetCustomers({
    params: {
      page,
      limit,
      search: debouncedInput,
    },
  });

  // dialog related
  const {
    data: dialogData,
    openDialog,
    closeDialog,
  } = useDialog<CustomerWithTransactionCount>();

  // actions
  const { mutate } = useDeleteCustomer({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Customer berhasil dihapus");
        closeDialog();
      },
      onError: (err) => {
        const message = getApiErrorMessage(err);

        toast.error(message);
        console.error(err);
      },
    },
  });

  const onCreateClick = () => {
    openDialog(DIALOG_KEY.customer.create, null);
  };

  const onDeleteConfirm = () => {
    mutate(dialogData.id);
  };

  return (
    <PageShell title="Customer">
      <Container>
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-4">
            <PageHeader>
              <PageHeaderHeading>Customer</PageHeaderHeading>
              <PageHeaderDescription>
                Kelola customer dan cek poin loyalti customer
              </PageHeaderDescription>
            </PageHeader>
            <Button onClick={onCreateClick} size="responsive">
              <Plus />
              <p className="hidden lg:block">Tambah customer</p>
            </Button>
          </div>

          <InputGroup className="border-border">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari customer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>

        <CustomerTable
          data={{
            customers: data?.data ?? [],
            totalPages: data?.meta.totalPages ?? 1,
          }}
          isLoading={isLoading}
        />
      </Container>

      {/* Dialogs */}
      <CreateCustomerDialog />
      <EditCustomerDialog />
      <DeleteCustomerAlert onConfirm={onDeleteConfirm} />
    </PageShell>
  );
};
