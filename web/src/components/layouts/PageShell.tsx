import React from "react";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

type PageShellProps = React.ComponentProps<"div"> & {
  title: string | React.ReactNode;
};

export const PageShell = ({
  className,
  title,
  children,
  ...props
}: PageShellProps) => {
  return (
    <div className="flex flex-col">
      <Header title={title} />
      <div {...props} className={cn("flex-1", className)}>
        {children}
      </div>
    </div>
  );
};
