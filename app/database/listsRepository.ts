import { TypeListRenderHome } from "../types/typesGlobal";
import db from "./db";
import { getItemsByListId } from "./listItemsRepository";

export function createList(
  name: string,
  category_id: number | null = null
): TypeListRenderHome {
  const result = db.runSync(
    "INSERT INTO lists (name, category_id) VALUES (?, ?)",
    [name, category_id]
  );

  return {
    id: result.lastInsertRowId,
    name,
    category_id,
    itens: [],
    favorited: false,
    created_at: new Date().toISOString(),
  };
}

export function getLists(): TypeListRenderHome[] {
  const lists = db.getAllSync<{
    id: number;
    name: string;
    category_id: number | null;
    is_favorite: number;
    created_at: string;
  }>("SELECT * FROM lists ORDER BY created_at DESC");

  return lists.map((row) => ({
    id: row.id,
    name: row.name,
    category_id: row.category_id,
    itens: getItemsByListId(row.id),
    favorited: row.is_favorite === 1,
    created_at: row.created_at,
  }));
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
  category_id: number | null = null
): void {
  db.runSync("UPDATE lists SET name = ?, category_id = ? WHERE id = ?", [
    name,
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

export function getFavoriteLists(): TypeListRenderHome[] {
  const lists = db.getAllSync<{
    id: number;
    name: string;
    category_id: number | null;
    is_favorite: number;
    created_at: string;
  }>("SELECT * FROM lists WHERE is_favorite = 1 ORDER BY created_at DESC");

  return lists.map((row) => ({
    id: row.id,
    name: row.name,
    category_id: row.category_id,
    itens: getItemsByListId(row.id),
    favorited: row.is_favorite === 1,
    created_at: row.created_at,
  }));
}

export function getListsByCategory(category_id: number): TypeListRenderHome[] {
  const lists = db.getAllSync<{
    id: number;
    name: string;
    category_id: number | null;
    is_favorite: number;
    created_at: string;
  }>("SELECT * FROM lists WHERE category_id = ? ORDER BY created_at DESC", [
    category_id,
  ]);

  return lists.map((row) => ({
    id: row.id,
    name: row.name,
    category_id: row.category_id,
    itens: [],
    favorited: row.is_favorite === 1,
    created_at: row.created_at,
  }));
}
