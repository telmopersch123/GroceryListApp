import { toggleFavorite } from "../database/listsRepository";
import { TypeListRenderHome } from "../types/typesGlobal";

export function FavoritedList(
  list: TypeListRenderHome,
  setListas: React.Dispatch<React.SetStateAction<TypeListRenderHome[]>>,
  flag?: string
) {
  toggleFavorite(list.id, !list.favorited);
  setListas((prev) => {
    if (flag === "favorites" && list.favorited) {
      return prev.filter((l) => l.id !== list.id);
    }

    return prev.map((item) =>
      item.id === list.id ? { ...item, favorited: !item.favorited } : item
    );
  });
}

export function FavoritedSingleList(
  list: TypeListRenderHome,
  setLista: React.Dispatch<React.SetStateAction<TypeListRenderHome | undefined>>
) {
  toggleFavorite(list.id, !list.favorited);

  setLista((prev) => (prev ? { ...prev, favorited: !prev.favorited } : prev));
}
