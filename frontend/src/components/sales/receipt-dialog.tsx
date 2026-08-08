/**
 * @fileOverview Receipt Dialog Component for SmartERP AI.
 * Renders a pixel-perfect, realistic POS thermal receipt preview for Cameroonian SMEs.
 * Includes native print utility via hidden iframe block to print POS receipts perfectly.
 */

import * as React from "react";
import { Printer, X, CreditCard, Smartphone, Banknote, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sale, Product } from "@/lib/types";

interface ReceiptDialogProps {
  sale: Sale | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessName?: string;
  taxId?: string;
  allProducts: Product[];
}

export function ReceiptDialog({
  sale,
  open,
  onOpenChange,
  businessName = "Superette de l'Avenir",
  taxId = "M012345678901L",
  allProducts,
}: ReceiptDialogProps) {
  if (!sale) return null;

  const formattedDate = new Date(sale.saleDate).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate items details
  const items = React.useMemo(() => {
    if (sale.productsSold && sale.productsSold.length > 0) {
      return sale.productsSold.map((item) => {
        const product = allProducts.find((p) => p.id === item.productId);
        return {
          name: product?.name || `Product (${item.productId.substring(0, 5)})`,
          quantity: item.quantity,
          price: item.priceAtSale,
          total: item.quantity * item.priceAtSale,
        };
      });
    }
    // Fallback if no specific products are logged (general sale)
    return [
      {
        name: "General Merchandise",
        quantity: 1,
        price: sale.totalAmount,
        total: sale.totalAmount,
      },
    ];
  }, [sale, allProducts]);

  // Calculations using whole integers for FCFA
  const subtotal = sale.totalAmount;
  const taxRate = 0.1925; // Cameroon VAT is 19.25%
  const computedTax = Math.round(subtotal * (taxRate / (1 + taxRate))); // Back-calculate tax from total
  const netAmount = subtotal - computedTax;

  const handlePrint = () => {
    // Create hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    const itemsHtml = items
      .map(
        (item) => `
      <tr>
        <td style="padding: 4px 0;">${item.name}</td>
        <td style="text-align: center; padding: 4px 0;">${item.quantity}</td>
        <td style="text-align: right; padding: 4px 0;">${item.price.toLocaleString()}</td>
        <td style="text-align: right; padding: 4px 0;">${item.total.toLocaleString()}</td>
      </tr>
    `
      )
      .join("");

    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt_${sale.id}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              width: 72mm;
              margin: 0 auto;
              padding: 10px 5px;
              font-size: 11px;
              line-height: 1.4;
              color: #000;
              background: #fff;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .header { margin-bottom: 12px; }
            .title { font-size: 14px; font-weight: bold; margin-bottom: 2px; text-transform: uppercase; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 10px; }
            th { border-bottom: 1px dashed #000; text-align: left; font-weight: bold; padding: 4px 0; }
            .totals-table td { padding: 2px 0; }
            .totals-row { font-weight: bold; font-size: 12px; }
            .footer { font-size: 8px; margin-top: 15px; }
            .barcode { font-size: 8px; font-family: monospace; letter-spacing: 3px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="text-center header">
            <div class="title">${businessName}</div>
            <div>Akwa, Douala, Cameroon</div>
            <div>NIU: ${taxId}</div>
            <div>Tel: +237 600 000 000</div>
          </div>

          <div class="divider"></div>

          <div><strong>Ref:</strong> ${sale.id}</div>
          <div><strong>Date:</strong> ${formattedDate}</div>
          <div><strong>Cashier:</strong> Operator</div>
          <div><strong>Payment:</strong> ${sale.paymentMethod}</div>

          <div class="divider"></div>

          <table>
            <thead>
              <tr>
                <th style="width: 45%;">Item</th>
                <th style="text-align: center; width: 10%;">Qty</th>
                <th style="text-align: right; width: 20%;">Price</th>
                <th style="text-align: right; width: 25%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="divider"></div>

          <table class="totals-table">
            <tr>
              <td>Subtotal (HT):</td>
              <td class="text-right">${netAmount.toLocaleString()} FCFA</td>
            </tr>
            <tr>
              <td>TVA (19.25%):</td>
              <td class="text-right">${computedTax.toLocaleString()} FCFA</td>
            </tr>
            <tr class="totals-row">
              <td>TOTAL (TTC):</td>
              <td class="text-right">${sale.totalAmount.toLocaleString()} FCFA</td>
            </tr>
          </table>

          <div class="divider"></div>

          <div class="text-center barcode">
            ||||| | |||| || ||| | ||
            <br>
            *${sale.id.substring(0, 8).toUpperCase()}*
          </div>

          <div class="text-center footer">
            * THANK YOU FOR YOUR PATRONAGE *<br>
            * MERCI POUR VOTRE FIDELITE *<br>
            SmartERP AI — Akwa Hub
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.frameElement.remove();
              }, 100);
            }
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(printHtml);
    doc.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-background border rounded-2xl shadow-xl p-6">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Printer className="size-5 text-primary" />
            Receipt Preview
          </DialogTitle>
        </DialogHeader>

        {/* Paper receipt slip simulation */}
        <div className="bg-card border border-muted/50 rounded-lg p-6 font-mono text-xs text-foreground shadow-inner max-h-[50vh] overflow-y-auto my-4 bg-amber-50/5">
          <div className="text-center space-y-1 mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wide text-primary font-sans">{businessName}</h3>
            <p className="text-[10px] text-muted-foreground">Akwa, Douala, Cameroon</p>
            <p className="text-[10px] text-muted-foreground font-sans">NIU: {taxId}</p>
            <p className="text-[10px] text-muted-foreground">Tel: +237 600 000 000</p>
          </div>

          <div className="border-b border-dashed my-3" />

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground font-sans">Reference:</span>
              <span className="font-bold font-mono text-[10px]">{sale.id.substring(0, 18)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-sans">Date:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-sans">Payment Method:</span>
              <span className="flex items-center gap-1">
                {sale.paymentMethod === "Cash" && <Banknote className="size-3 text-emerald-600" />}
                {sale.paymentMethod === "Mobile Money" && <Smartphone className="size-3 text-blue-600" />}
                {sale.paymentMethod === "Bank Transfer" && <CreditCard className="size-3 text-purple-600" />}
                {sale.paymentMethod === "Credit" && <ShoppingCart className="size-3 text-amber-600" />}
                <span className="font-semibold font-sans text-xs">{sale.paymentMethod}</span>
              </span>
            </div>
          </div>

          <div className="border-b border-dashed my-3" />

          <div className="space-y-2">
            <div className="grid grid-cols-4 font-bold text-muted-foreground border-b pb-1 mb-1 font-sans text-[10px]">
              <span className="col-span-2">Item</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Price</span>
            </div>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-1 text-[11px]">
                <span className="col-span-2 truncate">{item.name}</span>
                <span className="text-center">{item.quantity}</span>
                <span className="text-right font-semibold">{(item.price * item.quantity).toLocaleString()} FCFA</span>
              </div>
            ))}
          </div>

          <div className="border-b border-dashed my-3" />

          <div className="space-y-1.5 text-[11px] font-sans">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal (HT):</span>
              <span>{netAmount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TVA (19.25%):</span>
              <span>{computedTax.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between font-bold font-mono text-sm text-primary pt-1 border-t border-dotted">
              <span>TOTAL (TTC):</span>
              <span>{sale.totalAmount.toLocaleString()} FCFA</span>
            </div>
          </div>

          <div className="border-b border-dashed my-3" />

          <div className="text-center space-y-1">
            <p className="text-[10px] text-muted-foreground font-sans italic">* Thank you for your patronage! *</p>
            <p className="text-[10px] text-muted-foreground font-sans italic">* Merci pour votre fidélité! *</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs uppercase font-bold tracking-wider"
          >
            Close
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-primary hover:bg-primary/90 text-white text-xs uppercase font-bold tracking-wider px-6"
          >
            <Printer className="size-4 mr-2" />
            Print POS Slip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
