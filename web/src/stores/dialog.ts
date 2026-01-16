import { create } from "zustand";
import { shallow, useShallow } from "zustand/shallow";

type DialogState = {
  isOpen: boolean;
  mode: "create" | "edit" | "delete" | null;
  data: any | null;
};

type DialogActions = {
  actions: {
    openDialog: (
      mode: "create" | "edit" | "delete" | null,
      data: any | null,
    ) => void;
    closeDialog: () => void;
  };
};

const useDialogStore = create<DialogState & DialogActions>((set) => ({
  data: null,
  isOpen: false,
  mode: null,

  actions: {
    openDialog: (mode, data) =>
      set({
        isOpen: true,
        mode,
        data,
      }),
    closeDialog: () =>
      set({
        isOpen: false,
        mode: null,
        data: null,
      }),
  },
}));

export const useDialog = <T>() =>
  useDialogStore(
    useShallow((state) => ({
      data: state.data as T,
      isOpen: state.isOpen,
      mode: state.mode,
    })),
  );

export const useDialogActions = () =>
  useDialogStore(useShallow((state) => state.actions));
