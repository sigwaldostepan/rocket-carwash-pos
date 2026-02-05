import { Prisma } from 'generated/prisma/client';

export const TRANSACTION_BASE_SELECT: Prisma.TransactionSelect = {
  id: true,
  invoiceNo: true,
  total: true,
  subtotal: true,
  createdAt: true,
  complimentValue: true,
  isNightShift: true,
  isCompliment: true,
  paymentMethod: true,
};

export const TRANSACTION_SELECT_WITH_CUSTOMER: Prisma.TransactionSelect = {
  ...TRANSACTION_BASE_SELECT,
  customer: {
    select: {
      id: true,
      name: true,
      code: true,
      phoneNumber: true,
      point: true,
    },
  },
};

export const TRANSACTION_SELECT_WITH_DETAILS: Prisma.TransactionSelect = {
  ...TRANSACTION_BASE_SELECT,
  transactionDetail: {
    select: {
      id: true,
      item: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
      quantity: true,
      redeemedQuantity: true,
    },
  },
};
