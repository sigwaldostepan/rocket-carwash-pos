import React from "react";

type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section";
};

export const PageHeader = ({ as: Comp = "div", ...props }: PageHeaderProps) => {
  return <Comp className="space-y-2" {...props} />;
};

type PageHeaderHeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const PageHeaderHeading = ({
  as: Comp = "h1",
  ...props
}: PageHeaderHeadingProps) => {
  return <Comp className="text-2xl font-semibold" {...props} />;
};

type PageHeaderDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  as?: "p" | "span";
};

export const PageHeaderDescription = ({
  as: Comp = "p",
  ...props
}: PageHeaderDescriptionProps) => {
  return <Comp className="text-muted-foreground" {...props} />;
};
