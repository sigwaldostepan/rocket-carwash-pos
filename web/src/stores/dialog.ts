import { create } from "zustand";
import { useShallow } from "zustand/shallow";

export const DIALOG_KEY = {
  // Items
  item: {
    create: "CREATE-ITEM",
    edit: "EDIT-ITEM",
    delete: "DELETE-ITEM",
  },

  // Customer
  customer: {
    create: "CREATE-CUSTOMER",
    edit: "EDIT-CUSTOMER",
    delete: "DELETE-CUSTOMER",
  },

  // Expense
  expense: {
    create: "CREATE-EXPENSE",
    edit: "EDIT-EXPENSE",
    delete: "DELETE-EXPENSE",
  },

  // Expense Category
  expenseCategory: {
    create: "CREATE-EXPENSE-CATEGORY",
    edit: "EDIT-EXPENSE-CATEGORY",
    delete: "DELETE-EXPENSE-CATEGORY",
  },

  // Transaction
  transaction: {
    redeemPoint: "REDEEM-POINT",
    pickCustomer: "PICK-CUSTOMER",
    payment: "PAYMENT",
    printInvoice: "PRINT-INVOICE",
    delete: "DELETE-TRANSACTION",
  },
} as const;

// helper type to extract all possible dialog key
type NestedValues<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? NestedValues<T[K]> : T[K] }[keyof T]
  : T;

export type DialogKey = NestedValues<typeof DIALOG_KEY>;

type DialogState = {
  isOpen: boolean;
  key: DialogKey | null;
  data: any | null;
};

type DialogActions = {
  openDialog: (key: DialogKey, data: any | null) => void;
  closeDialog: () => void;
  setIsOpen: (key: DialogKey, open: boolean) => void;
};

const useDialogStore = create<DialogState & DialogActions>((set) => ({
  data: null,
  isOpen: false,
  key: null,
  openDialog: (key, data) =>
    set({
      isOpen: true,
      key: key,
      data,
    }),
  closeDialog: () =>
    set({
      isOpen: false,
      key: null,
      data: null,
    }),
  setIsOpen: (key, open) =>
    set({
      isOpen: open,
      key: key,
      data: null,
    }),
}));

export const useDialog = <T>() =>
  useDialogStore(
    useShallow((state) => ({
      data: state.data as T,
      isOpen: state.isOpen,
      key: state.key,
      openDialog: state.openDialog,
      closeDialog: state.closeDialog,
      setIsOpen: state.setIsOpen,
    })),
  );
