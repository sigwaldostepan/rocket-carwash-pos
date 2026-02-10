"use client";

import { ExpenseCategorySummary } from "@/types/api/report";
import { CategoryDetailItem } from "./CategoryDetailItem";

type CategoryDetailProps = {
  data: ExpenseCategorySummary[];
};

export const CategoryDetail = ({ data }: CategoryDetailProps) => {
  // Sort by total descending
  const sortedData = [...data].sort((a, b) => b.total - a.total);

  return (
    <div className="divide-y">
      {sortedData.map((item) => (
        <CategoryDetailItem key={item.category.id} data={item} />
      ))}
    </div>
  );
};
