import { Spinner } from "../ui/spinner";

export const PageLoader = () => {
  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center">
      <Spinner className="size-12" />
    </div>
  );
};
