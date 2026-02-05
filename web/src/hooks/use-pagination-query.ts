import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  PAGINATION_KEY,
} from "@/constants/pagination";
import { useRouter, useSearchParams } from "next/navigation";

export const usePaginationQuery = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawPage = Number(searchParams.get(PAGINATION_KEY.PAGE));
  const rawLimit = Number(searchParams.get(PAGINATION_KEY.LIMIT));

  const page =
    Number.isInteger(rawPage) && rawPage >= 1
      ? rawPage
      : DEFAULT_PAGINATION_PAGE;

  const limit =
    Number.isInteger(rawLimit) && rawLimit >= 1 && rawLimit <= 100
      ? rawLimit
      : DEFAULT_PAGINATION_LIMIT;

  type SetPaginationParams = {
    page: number;
    limit: number;
  };
  const setPagination = ({ page, limit }: SetPaginationParams) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));
    params.set("limit", String(limit));

    router.replace(`?${params.toString()}`);
  };

  return {
    page,
    limit,
    setPagination,
  };
};
