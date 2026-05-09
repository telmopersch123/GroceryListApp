import { TypeItens, TypeListRenderHome } from "../types/typesGlobal";
import { buildCopyName } from "../utils/functionCopyName";
import db from "./db";
import { createItem } from "./listItemsRepository";
export const LIMITE_LISTAS = 50;
export const LIMITE_LISTAS_POR_CATEGORIA = 10;
export function createList(
  name: string,
  category_id: number | null = null,
  itens?: TypeItens[],
  flag?: string,
  typeCopy?: string
): TypeListRenderHome {
  const count = db.getFirstSync<{ total: number }>(
    "SELECT COUNT(*) as total FROM lists"
  );

  if (count && count.total >= LIMITE_LISTAS) {
    throw new Error("LIMITE_LISTAS");
  }

  const finalName = flag === "copy" ? buildCopyName(name) : name;
  const isFavorite = typeCopy === "favorites" ? 1 : 0;
  const result = db.runSync(
    "INSERT INTO lists (name, category_id, is_favorite) VALUES  (?, ?, ?)",
    [finalName, category_id, isFavorite]
  );

  const newListId = result.lastInsertRowId;

  if (flag === "copy" && itens && itens.length > 0) {
    for (const item of itens) {
      createItem(newListId, item.name);
    }
  }

  return {
    id: newListId,
    name: finalName,
    category_id,
    itens:
      flag === "copy" && itens
        ? itens.map((i) => ({ ...i, list_id: newListId, checked: false }))
        : [],
    favorited: typeCopy === "favorites" ? true : false,
    created_at: new Date().toISOString(),
  };
}

export function getLists(): TypeListRenderHome[] {
  const rows = db.getAllSync<{
    id: number;
    name: string;
    category_id: number | null;
    is_favorite: number;
    created_at: string;
    item_id: number | null;
    item_name: string | null;
    is_checked: number | null;
  }>(`SELECT 
        l.id, l.name, l.category_id, l.is_favorite, l.created_at,
        li.id as item_id, li.name as item_name, li.is_checked
      FROM lists l
      LEFT JOIN list_items li ON li.list_id = l.id
      ORDER BY created_at DESC, li.id ASC
      `);

  const listsMap = new Map<number, TypeListRenderHome>();

  for (const row of rows) {
    if (!listsMap.has(row.id)) {
      listsMap.set(row.id, {
        id: row.id,
        name: row.name,
        category_id: row.category_id,
        favorited: row.is_favorite === 1,
        created_at: row.created_at,
        itens: [],
      });
    }

    if (row.item_id !== null && row.item_name !== null) {
      listsMap.get(row.id)!.itens.push({
        id: row.item_id,
        name: row.item_name,
        checked: row.is_checked === 1,
        list_id: row.id,
      });
    }
  }

  return Array.from(listsMap.values());
}

export function getListById(id: number): TypeListRenderHome | null {
  const row = db.getFirstSync<{
    id: number;
    name: string;
    category_id: number | null;
    is_favorite: number;
    created_at: string;
  }>("SELECT * FROM lists WHERE id = ?", [id]);

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    category_id: row.category_id,
    itens: [],
    favorited: row.is_favorite === 1,
    created_at: row.created_at,
  };
}

export function updateList(
  id: number,
  name: string,
  category_id: number | null = null,
  itens: TypeItens[] = []
): TypeListRenderHome {
  db.runSync("UPDATE lists SET name = ?, category_id = ? WHERE id = ?", [
    name,
    category_id,
    id,
  ]);
  db.runSync("DELETE FROM list_items WHERE list_id = ?", [id]);
  for (const item of itens) {
    createItem(id, item.name, item.checked);
  }

  return {
    id,
    name,
    category_id,
    itens: itens.map((i) => ({ ...i, list_id: id })),
    favorited: getListById(id)?.favorited || false,
    created_at: getListById(id)?.created_at || new Date().toISOString(),
  };
}

export function updateListCategory(
  id: number,
  category_id: number | null
): void {
  if (category_id !== null) {
    const count = db.getFirstSync<{ total: number }>(
      "SELECT COUNT(*) as total FROM lists WHERE category_id = ? AND id != ?",
      [category_id, id]
    );
    if (count && count.total >= LIMITE_LISTAS_POR_CATEGORIA) {
      throw new Error("LIMITE_LISTAS_POR_CATEGORIA");
    }
  }
  db.runSync("UPDATE lists SET category_id = ? WHERE id = ?", [
    category_id,
    id,
  ]);
}

export function toggleFavorite(id: number, favorited: boolean): void {
  db.runSync("UPDATE lists SET is_favorite = ? WHERE id = ?", [
    favorited ? 1 : 0,
    id,
  ]);
}

export function deleteList(id: number): void {
  db.runSync("DELETE FROM lists WHERE id = ?", [id]);
}

export function getListsByCategory(category_id: number): TypeListRenderHome[] {
  const rows = db.getAllSync<{
    id: number;
    name: string;
    category_id: number | null;
    is_favorite: number;
    created_at: string;
    item_id: number | null;
    item_name: string | null;
    is_checked: number | null;
  }>(
    `SELECT 
        l.id, l.name, l.category_id, l.is_favorite, l.created_at,
        li.id as item_id, li.name as item_name, li.is_checked
      FROM lists l
      LEFT JOIN list_items li ON li.list_id = l.id
      WHERE l.category_id = ?
      ORDER BY l.created_at DESC, li.id ASC`,
    [category_id]
  );

  const listsMap = new Map<number, TypeListRenderHome>();

  for (const row of rows) {
    if (!listsMap.has(row.id)) {
      listsMap.set(row.id, {
        id: row.id,
        name: row.name,
        category_id: row.category_id,
        favorited: row.is_favorite === 1,
        created_at: row.created_at,
        itens: [],
      });
    }
    if (row.item_id !== null && row.item_name !== null) {
      listsMap.get(row.id)!.itens.push({
        id: row.item_id,
        name: row.item_name,
        checked: row.is_checked === 1,
        list_id: row.id,
      });
    }
  }

  return Array.from(listsMap.values());
}
