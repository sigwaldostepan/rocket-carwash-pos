import { cn } from "@/lib/utils";
import React from "react";

type ContainerProps = React.ComponentProps<"div">;

export const Container = ({
  children,
  className,
  ...props
}: ContainerProps) => {
  return (
    <div
      className={cn("container mx-auto space-y-6 px-4 py-6", className)}
      {...props}
    >
      {children}
    </div>
  );
};
