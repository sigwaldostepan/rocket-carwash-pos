export const formatThousand = (value: number) => {
  return new Intl.NumberFormat("id-ID").format(value);
};

export const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    style: "currency",
    minimumFractionDigits: 0,
  }).format(value);
};
