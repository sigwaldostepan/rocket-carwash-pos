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
} as const;

export type DialogKey =
  (typeof DIALOG_KEY)[keyof typeof DIALOG_KEY][keyof (typeof DIALOG_KEY)[keyof typeof DIALOG_KEY]];

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
