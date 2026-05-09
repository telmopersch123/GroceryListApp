import { TypeItens } from "../types/typesGlobal";
import db from "./db";
export const LIMITE_ITENS = 100;
export function createItem(
  list_id: number,
  name: string,
  checked?: boolean
): TypeItens {
  const count = db.getFirstSync<{ total: number }>(
    "SELECT COUNT(*) as total FROM list_items WHERE list_id = ?",
    [list_id]
  );
  if (count && count.total >= LIMITE_ITENS) {
    throw new Error("LIMITE_ITENS");
  }

  const result = db.runSync(
    "INSERT INTO list_items (list_id, name, is_checked) VALUES (?, ?, ?)",
    [list_id, name, checked === true ? 1 : 0]
  );

  return {
    id: result.lastInsertRowId,
    list_id,
    name,
    checked: checked === true,
  };
}

export function getItemsByListId(list_id: number): TypeItens[] {
  const result = db.getAllSync<{
    id: number;
    list_id: number;
    name: string;
    is_checked: number;
  }>("SELECT * FROM list_items WHERE list_id = ? ORDER BY id ASC", [list_id]);

  return result.map((row) => ({
    id: row.id,
    list_id: row.list_id,
    name: row.name,
    checked: row.is_checked === 1,
  }));
}

export function toggleItem(id: number, checked: boolean): void {
  db.runSync("UPDATE list_items SET is_checked = ? WHERE id = ?", [
    checked ? 1 : 0,
    id,
  ]);
}

export function updateItem(id: number, name: string): void {
  db.runSync("UPDATE list_items SET name = ? WHERE id = ?", [name, id]);
}

export function deleteItem(id: number): void {
  db.runSync("DELETE FROM list_items WHERE id = ?", [id]);
}
