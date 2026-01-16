import { generatePagination } from "@/utils/generate-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "../pagination";
import { Button, buttonVariants } from "../button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table as TanstackTable } from "@tanstack/react-table";
import React from "react";

type DataTablePaginationProps<TData> = React.ComponentProps<
  typeof Pagination
> & {
  table: TanstackTable<TData>;
  showNextPrev?: boolean;
};

export const DataTablePagination = <TData,>({
  table,
  showNextPrev,
  ...props
}: DataTablePaginationProps<TData>) => {
  const { pageIndex } = table.getState().pagination;

  const currentPage = pageIndex + 1;
  const totalPages = table.getPageCount();

  const pages = generatePagination(currentPage, totalPages);

  return (
    <Pagination {...props}>
      <PaginationContent>
        {!!showNextPrev && (
          <PaginationItem>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </Button>
          </PaginationItem>
        )}
        {pages.map((page, i) => (
          <PaginationItem key={`pagination-btn-${i}`}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <Button
                onClick={() => table.setPageIndex(+page - 1)}
                disabled={page === currentPage}
                className={cn(
                  page === currentPage
                    ? buttonVariants({ variant: "default", size: "icon-sm" })
                    : buttonVariants({ variant: "outline", size: "icon-sm" }),
                )}
              >
                {page}
              </Button>
            )}
          </PaginationItem>
        ))}
        {!!showNextPrev && (
          <PaginationItem>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
