export type TypeListRenderHome = {
  id: number;
  name: string;
  itens: TypeItens[];
  favorited: boolean;
  category_id: number | null;
  created_at: string;
};

export type TypeItens = {
  id: number;
  list_id: number;
  name: string;
  checked: boolean;
};

export interface Categoria {
  id: number;
  nome: string;
  icon: string;
  created_at: string;
}
