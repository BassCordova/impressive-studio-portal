import { put, list, del, get } from "@vercel/blob";

/**
 * Repositorio genérico sobre Vercel Blob (store privado) para registros JSON
 * identificados por `id`. Centraliza el patrón get/list/save/delete que antes
 * estaba duplicado en cada store. Migrar a una base de datos real (Postgres/KV)
 * en el futuro es cambiar solo esta implementación detrás de la misma interfaz.
 */
export function createBlobStore<T extends { id: string; createdAt: string }>(
  prefix: string,
  normalize: (raw: any) => T = (raw) => raw as T
) {
  const pathFor = (id: string) => `${prefix}${id}.json`;

  async function readBlob(pathname: string): Promise<T | null> {
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    const text = await new Response(result.stream).text();
    try {
      return normalize(JSON.parse(text));
    } catch {
      // Blob corrupto: no rompemos el listado completo, lo omitimos.
      return null;
    }
  }

  return {
    async save(item: T): Promise<T> {
      await put(pathFor(item.id), JSON.stringify(item, null, 2), {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return item;
    },
    get(id: string): Promise<T | null> {
      return readBlob(pathFor(id));
    },
    async list(): Promise<T[]> {
      const { blobs } = await list({ prefix });
      const items = await Promise.all(blobs.map((b) => readBlob(b.pathname)));
      const filtered: T[] = items.filter((x) => x !== null) as T[];
      return filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    },
    async delete(id: string): Promise<void> {
      await del(pathFor(id));
    },
  };
}
