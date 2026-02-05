import { PaymentMethod } from "@/constants/transaction";
import { Transaction } from "@/types/api/transaction";
import { formatRupiah } from "@/utils/currency";
import { format } from "date-fns";
import React from "react";
import { TransactionItem } from "../../../types";

type InvoiceReceiptProps = {
  transaction: Transaction;
  items: TransactionItem[];
  customerName?: string;
  paymentMethod: PaymentMethod;
  discount: number;
  paidAmount: number;
  changeAmount: number;
};

const InvoiceAttribute = ({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div className="flex justify-between text-[10px]" style={{ lineHeight: 1.2 }}>
    <span style={{ fontWeight: bold ? "bold" : "normal" }}>{label}</span>
    <span style={{ fontWeight: bold ? "bold" : "normal" }}>{value}</span>
  </div>
);

export const InvoiceReceipt = React.forwardRef<
  HTMLDivElement,
  InvoiceReceiptProps
>(
  (
    {
      transaction,
      items,
      customerName,
      paymentMethod,
      discount,
      paidAmount,
      changeAmount,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={{
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          fontSize: "10px",
          padding: "8px",
          width: "58mm",
          margin: "0 auto",
          lineHeight: 1.2,
          color: "black",
        }}
        className="print-content"
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <strong style={{ fontSize: "12px" }}>ROCKET CARWASH</strong>
          <div>Jl. Indraprasta No. 132, Semarang</div>
          <div>081227577954</div>
        </div>

        {/* Divider */}
        <div style={{ borderBottom: "1px dashed black", margin: "4px 0" }} />

        {/* Info */}
        <div style={{ marginTop: "4px", marginBottom: "4px" }}>
          <div>No Invoice : {transaction.invoiceNo}</div>
          <div>
            Tanggal :{" "}
            {format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm")}
          </div>
          <div>Customer : {customerName ?? "-"}</div>
        </div>

        {/* Divider */}
        <div style={{ borderBottom: "1px dashed black", margin: "4px 0" }} />

        {/* Items Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          <span>Layanan</span>
          <span>Harga</span>
        </div>

        {/* Items List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {items.map((item) => (
            <div key={item.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{item.name}</span>
                <span>{formatRupiah(item.price)}</span>
              </div>
              {item.quantity > 1 && (
                <div
                  style={{
                    fontSize: "9px",
                    fontStyle: "italic",
                    marginLeft: "8px",
                  }}
                >
                  {item.quantity} x {formatRupiah(item.price)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderBottom: "1px dashed black", margin: "8px 0" }} />

        {/* Totals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <InvoiceAttribute
            label="Subtotal"
            value={formatRupiah(transaction.subtotal)}
          />
          {discount > 0 && (
            <InvoiceAttribute
              label="Diskon"
              value={`-${formatRupiah(discount)}`}
            />
          )}
          <div style={{ borderBottom: "1px dashed black", margin: "2px 0" }} />
          <InvoiceAttribute
            label="Total"
            value={formatRupiah(transaction.total)}
            bold
          />
          <InvoiceAttribute label="Metode Bayar" value={paymentMethod} />
          <div style={{ marginTop: "4px" }} />
          <InvoiceAttribute label="Bayar" value={formatRupiah(paidAmount)} />
          <InvoiceAttribute
            label="Kembali"
            value={formatRupiah(changeAmount)}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "16px",
            borderTop: "1px dashed black",
            paddingTop: "8px",
          }}
        >
          <div>Terima kasih atas kunjungan Anda!</div>
        </div>
      </div>
    );
  },
);

InvoiceReceipt.displayName = "InvoiceReceipt";
