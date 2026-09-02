import { Prisma } from 'generated/prisma/client';

export const DRAFT_SELECT: Prisma.DraftSelect = {
  id: true,
  createdAt: true,
  customer: {
    select: {
      id: true,
      name: true,
      code: true,
      phoneNumber: true,
      point: true,
    },
  },
  detail: {
    select: {
      id: true,
      quantity: true,
      redeemedQuantity: true,
      item: {
        select: {
          id: true,
          name: true,
          price: true,
          isRedeemable: true,
          isGetPoint: true,
          canBeComplimented: true,
        },
      },
    },
  },
};
