import { InboxIcon } from "lucide-react";

type ReportDetailEmptyStateProps = {
  message?: string;
};

export const ReportDetailEmptyState = ({
  message = "Tidak ada data untuk ditampilkan",
}: ReportDetailEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <span className="bg-muted mb-3 flex size-12 items-center justify-center rounded-full">
        <InboxIcon className="text-muted-foreground h-6 w-6" />
      </span>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
};
