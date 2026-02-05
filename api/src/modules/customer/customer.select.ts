import { Prisma } from 'generated/prisma/client';

export const CUSTOMER_BASE_SELECT: Prisma.CustomerSelect = {
  id: true,
  name: true,
  code: true,
  phoneNumber: true,
  point: true,
};

export const CUSTOMER_SELECT_WITH_TRANSACTION_COUNT: Prisma.CustomerSelect = {
  ...CUSTOMER_BASE_SELECT,
  _count: {
    select: {
      transaction: true,
    },
  },
};

export const CUSTOMER_SELECT_WITH_TRANSACTION: Prisma.CustomerSelect = {
  ...CUSTOMER_BASE_SELECT,
  transaction: {
    select: {
      id: true,
      invoiceNo: true,
      complimentValue: true,
      total: true,
      subtotal: true,
      paymentMethod: true,
      isCompliment: true,
      isNightShift: true,
    },
  },
};
