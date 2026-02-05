"use client";

import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Customer } from "@/types/api/customer";
import React from "react";
import { PickCustomerListItem } from "./PickCustomerListItem";
import { PickCustomerListItemSkeleton } from "./PickCustomerListItemSkeleton";
import { NO_CUSTOMER } from "@/constants/transaction";

type PickCustomerListsProps = React.ComponentProps<typeof CommandList> & {
  customers: Customer[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onCustomerSelect: (customer: Customer | undefined) => void;
  fetchNextPage: () => void;
};

export const PickCustomerLists = ({
  customers,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  className,
  onCustomerSelect,
  fetchNextPage,
  ...props
}: PickCustomerListsProps) => {
  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, isLoading, hasNextPage, isFetchingNextPage]);

  return (
    <CommandList {...props} className={cn("", className)}>
      <CommandGroup className="px-2">
        <CommandItem
          className="border-border flex w-full items-center justify-between rounded-lg border p-4!"
          onSelect={() => onCustomerSelect(NO_CUSTOMER)}
        >
          <p>Tanpa Customer</p>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Hasil pencarian" className="px-2 pb-6">
        {!isLoading && customers.length < 1 && (
          <CommandEmpty>
            <p>Customer tidak ditemukan</p>
          </CommandEmpty>
        )}
        <div className="flex flex-col space-y-2">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <PickCustomerListItemSkeleton key={i} />
              ))
            : customers?.map((customer) => (
                <PickCustomerListItem
                  key={customer.id}
                  customer={customer}
                  onCustomerSelect={() => onCustomerSelect(customer)}
                />
              ))}

          <div
            ref={observerTarget}
            className="flex items-center justify-center"
          >
            {isFetchingNextPage && <Spinner />}
          </div>
        </div>
      </CommandGroup>
    </CommandList>
  );
};
