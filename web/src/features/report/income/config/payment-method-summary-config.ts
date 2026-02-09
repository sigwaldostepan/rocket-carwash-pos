import {
  Banknote,
  CreditCard,
  Gift,
  HelpCircle,
  Landmark,
  LucideIcon,
  QrCode,
} from "lucide-react";

type PaymentMethodConfig = {
  label: string;
  icon: LucideIcon;
  color: string;
  progressColor: string;
  progressIndicatorColor: string;
};

// Green list payment methods (current API values)
const PAYMENT_METHOD_CONFIG: Record<string, PaymentMethodConfig> = {
  // Current API values
  Tunai: {
    label: "Tunai",
    icon: Banknote,
    color: "text-emerald-500 bg-emerald-500/10",
    progressColor: "bg-emerald-500/10",
    progressIndicatorColor: "bg-emerald-500",
  },
  QRIS: {
    label: "QRIS Mobile",
    icon: QrCode,
    color: "text-blue-500 bg-blue-500/10",
    progressColor: "bg-blue-500/10",
    progressIndicatorColor: "bg-blue-500",
  },
  EDC: {
    label: "EDC Card Terminal",
    icon: CreditCard,
    color: "text-slate-500 bg-slate-500/10",
    progressColor: "bg-slate-500/10",
    progressIndicatorColor: "bg-slate-400",
  },
  Transfer: {
    label: "Bank Transfer",
    icon: Landmark,
    color: "text-indigo-500 bg-indigo-500/10",
    progressColor: "bg-indigo-500/10",
    progressIndicatorColor: "bg-indigo-500",
  },
  Komplimen: {
    label: "Komplimen",
    icon: Gift,
    color: "text-rose-500 bg-rose-500/10",
    progressColor: "bg-rose-500/10",
    progressIndicatorColor: "bg-rose-500",
  },
  // Legacy data from previous POS system
  Cash: {
    label: "Cash (Legacy)",
    icon: Banknote,
    color: "text-emerald-500 bg-emerald-500/10",
    progressColor: "bg-emerald-500/10",
    progressIndicatorColor: "bg-emerald-500",
  },
  "Bank Transfer, QRIS": {
    label: "Bank Transfer + QRIS",
    icon: Landmark,
    color: "text-indigo-500 bg-indigo-500/10",
    progressColor: "bg-indigo-500/10",
    progressIndicatorColor: "bg-indigo-500",
  },
  "Bank Transfer, Transfer": {
    label: "Bank Transfer (Legacy)",
    icon: Landmark,
    color: "text-indigo-500 bg-indigo-500/10",
    progressColor: "bg-indigo-500/10",
    progressIndicatorColor: "bg-indigo-500",
  },
  "Kartu Debit/Kredit, EDC ": {
    label: "Debit/Credit Card",
    icon: CreditCard,
    color: "text-slate-500 bg-slate-500/10",
    progressColor: "bg-slate-500/10",
    progressIndicatorColor: "bg-slate-400",
  },
  "": {
    label: "Tidak Diketahui",
    icon: HelpCircle,
    color: "text-gray-400 bg-gray-400/10",
    progressColor: "bg-gray-400/10",
    progressIndicatorColor: "bg-gray-400",
  },
};

const DEFAULT_CONFIG: PaymentMethodConfig = {
  label: "Lainnya",
  icon: HelpCircle,
  color: "text-gray-500 bg-gray-500/10",
  progressColor: "bg-gray-500/10",
  progressIndicatorColor: "bg-gray-500",
};

export const getPaymentMethodConfig = (method: string): PaymentMethodConfig => {
  // Try exact match first
  if (PAYMENT_METHOD_CONFIG[method]) {
    return PAYMENT_METHOD_CONFIG[method];
  }

  // Try trimmed match (handles trailing spaces)
  const trimmed = method.trim();
  if (PAYMENT_METHOD_CONFIG[trimmed]) {
    return PAYMENT_METHOD_CONFIG[trimmed];
  }

  // Fallback with the original method as label
  return {
    ...DEFAULT_CONFIG,
    label: method || "Tidak Diketahui",
  };
};
