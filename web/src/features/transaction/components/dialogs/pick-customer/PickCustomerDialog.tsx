"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from "@/constants/pagination";
import { useGetInfiniteCustomers } from "@/features/customer/api/get-customers";
import { useDebounce } from "@/hooks/use-debounce";
import { useTransactionCustomerStore } from "@/features/transaction/stores";
import { Customer } from "@/types/api/customer";
import { Gift } from "lucide-react";
import { useState } from "react";
import { PickCustomerLists } from "./PickCustomerLists";
import { NO_CUSTOMER } from "@/constants/transaction";

type PickCustomerDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const PickCustomerDialog = ({
  isOpen,
  setIsOpen,
}: PickCustomerDialogProps) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce({ value: search });

  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetInfiniteCustomers({
      params: {
        page: DEFAULT_PAGINATION_PAGE,
        limit: DEFAULT_PAGINATION_LIMIT,
        search: debouncedSearch,
      },
    });

  const customers = data?.pages.flatMap((page) => page.data);

  const { setCustomer } = useTransactionCustomerStore();

  const onCustomerSelect = (customer: Customer | undefined) => {
    if (!customer) {
      setCustomer(NO_CUSTOMER);
    }

    setCustomer(customer!);
    setIsOpen(false);
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Cari customer..."
          value={search}
          onValueChange={setSearch}
        />
        <PickCustomerLists
          className="pt-6"
          customers={customers ?? []}
          isLoading={isPending}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onCustomerSelect={onCustomerSelect}
          fetchNextPage={fetchNextPage}
        />
      </Command>
    </CommandDialog>
  );
};
