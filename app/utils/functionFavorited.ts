import { toggleFavorite } from "../database/listsRepository";
import { TypeListRenderHome } from "../types/typesGlobal";

export function FavoritedList(
  list: TypeListRenderHome,
  setListas: React.Dispatch<React.SetStateAction<TypeListRenderHome[]>>
) {
  toggleFavorite(list.id, !list.favorited);

  setListas((prev) => {
    const updated = prev.map((item) =>
      item.id === list.id ? { ...item, favorited: !item.favorited } : item
    );
    return updated;
  });
}

export function FavoritedSingleList(
  list: TypeListRenderHome,
  setListas: React.Dispatch<React.SetStateAction<TypeListRenderHome[]>>
) {
  toggleFavorite(list.id, !list.favorited);

  setListas((prev) =>
    prev.map((l) => (l.id === list.id ? { ...l, favorited: !l.favorited } : l))
  );
}
