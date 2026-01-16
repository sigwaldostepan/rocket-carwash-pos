export const isPhoneNumber = (input: string): boolean => {
  const cleaned = input.replace(/[^0-9+]/g, '');

  return /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/.test(cleaned);
};
