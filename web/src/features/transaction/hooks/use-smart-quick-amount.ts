import { useMemo } from "react";

const ROUND_UP_DENOMINATIONS = [1000, 2000, 5000, 10000];
const QUICK_AMOUNTS = [10000, 20000, 50000, 100000];

export const useSmartQuickAmounts = (totalPrice: number) => {
  return useMemo(() => {
    const amounts = new Set<number>();

    // Add exact amount
    amounts.add(totalPrice);

    // Round up to nearest common denominations
    for (const round of ROUND_UP_DENOMINATIONS) {
      const rounded = Math.ceil(totalPrice / round) * round;
      if (rounded > totalPrice && rounded <= totalPrice * 2) {
        amounts.add(rounded);
      }
    }

    // Add common quick amounts that are >= totalPrice
    for (const amount of QUICK_AMOUNTS) {
      if (amount >= totalPrice) {
        amounts.add(amount);
      }
    }

    // Sort and take first 4
    return Array.from(amounts)
      .sort((a, b) => a - b)
      .slice(0, 4);
  }, [totalPrice]);
};
