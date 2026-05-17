import { Categoria } from "../app/types/typesGlobal";
import db from "./db";
export const LIMITE_CATEGORIAS = 10;
export function createCategory(nome: string, icon: number): Categoria {
  const count = db.getFirstSync<{ total: number }>(
    "SELECT COUNT(*) as total FROM categories"
  );
  if (count && count.total >= LIMITE_CATEGORIAS) {
    throw new Error("LIMITE_CATEGORIAS");
  }
  const result = db.runSync(
    "INSERT INTO categories (name, icon) VALUES (?, ?)",
    [nome, icon]
  );

  return {
    id: result.lastInsertRowId,
    nome,
    icon,
    created_at: new Date().toISOString(),
  };
}

export function getCategories(): Categoria[] {
  const result = db.getAllSync<{
    id: number;
    name: string;
    icon: number;
    created_at: string;
  }>("SELECT * FROM categories ORDER BY created_at DESC");

  return result.map((row) => ({
    id: row.id,
    nome: row.name,
    icon: row.icon,
    created_at: row.created_at,
  }));
}

export function deleteCategory(id: number): boolean {
  db.runSync("UPDATE lists SET category_id = NULL WHERE category_id = ?", [id]);
  const result = db.runSync("DELETE FROM categories WHERE id = ?", [id]);
  return result.changes > 0;
}
