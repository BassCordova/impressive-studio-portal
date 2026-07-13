export type QuoteItem = {
  nombre: string;
  descripcion?: string;
  cantidad: number;
  precioUnitario: number;
};

export type QuoteStatus = "enviada" | "aceptada" | "rechazada";

export type Quote = {
  id: string;
  createdAt: string;
  vendedor: string;
  cliente: {
    nombre: string;
    empresa?: string;
    email?: string;
  };
  moneda: "CLP" | "USD";
  items: QuoteItem[];
  descuentoPct?: number;
  validezDias: number;
  condicionesPago?: string;
  notas?: string;
  estado: QuoteStatus;
};

export function calcularTotal(quote: Pick<Quote, "items" | "descuentoPct">) {
  const subtotal = quote.items.reduce(
    (acc, item) => acc + item.cantidad * item.precioUnitario,
    0
  );
  const descuento = subtotal * ((quote.descuentoPct ?? 0) / 100);
  return {
    subtotal,
    descuento,
    total: subtotal - descuento,
  };
}

export function formatMoney(amount: number, moneda: "CLP" | "USD") {
  return new Intl.NumberFormat(moneda === "CLP" ? "es-CL" : "en-US", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: moneda === "CLP" ? 0 : 2,
  }).format(amount);
}
