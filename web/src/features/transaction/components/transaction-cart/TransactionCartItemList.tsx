import { Customer } from "@/types/api/customer";
import { useTransactionCartStore } from "../../stores";
import { TransactionCartItem } from "./TransactionCartItem";

type TransactionCartItemListProps = {
  customer: Customer | undefined;
};

export const TransactionCartItemList = ({
  customer,
}: TransactionCartItemListProps) => {
  const { cartItems } = useTransactionCartStore();

  return (
    <>
      {cartItems.length === 0 ? (
        <div className="flex h-full items-center justify-center text-center">
          <p className="text-muted-foreground text-sm">
            Belum ada item yang dipilih
          </p>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          {cartItems.map((item) => (
            <TransactionCartItem
              key={item.id}
              canRedeem={!!customer}
              item={item}
            />
          ))}
        </div>
      )}
    </>
  );
};
