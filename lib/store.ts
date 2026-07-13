import { put, list, del } from "@vercel/blob";
import type { Quote } from "./types";

const PREFIX = "quotes/";

export async function saveQuote(quote: Quote) {
  await put(`${PREFIX}${quote.id}.json`, JSON.stringify(quote, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return quote;
}

export async function getQuote(id: string): Promise<Quote | null> {
  const { blobs } = await list({ prefix: `${PREFIX}${id}.json` });
  const match = blobs.find((b) => b.pathname === `${PREFIX}${id}.json`);
  if (!match) return null;
  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as Quote;
}

export async function listQuotes(): Promise<Quote[]> {
  const { blobs } = await list({ prefix: PREFIX });
  const quotes = await Promise.all(
    blobs.map(async (b) => {
      const res = await fetch(b.url, { cache: "no-store" });
      if (!res.ok) return null;
      return (await res.json()) as Quote;
    })
  );
  return quotes
    .filter((q): q is Quote => q !== null)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function deleteQuote(id: string) {
  await del(`${PREFIX}${id}.json`);
}
