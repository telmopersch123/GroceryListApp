import { Categoria } from "../types/typesGlobal";
import db from "./db";

export function createCategory(nome: string, icon: number): Categoria {
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

// export function updateCategory(id: number, nome: string, icon: string): void {
//   db.runSync("UPDATE categories SET name = ?, icon = ? WHERE id = ?", [
//     nome,
//     icon,
//     id,
//   ]);
// }

export function deleteCategory(id: number): boolean {
  db.runSync("UPDATE lists SET category_id = NULL WHERE category_id = ?", [id]);
  const result = db.runSync("DELETE FROM categories WHERE id = ?", [id]);
  return result.changes > 0;
}
