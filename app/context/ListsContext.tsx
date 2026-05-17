import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { getLists } from "../../database/listsRepository";
import { TypeListRenderHome } from "../types/typesGlobal";

type ListsContextType = {
  listas: TypeListRenderHome[];
  carregarListas: () => void;
  setListas: React.Dispatch<React.SetStateAction<TypeListRenderHome[]>>;
  listasCarregadas: boolean;
};

const ListsContext = createContext<ListsContextType>({} as ListsContextType);

export function ListsProvider({ children }: { children: ReactNode }) {
  const [listas, setListas] = useState<TypeListRenderHome[]>([]);
  const [listasCarregadas, setListasCarregadas] = useState(false);
  const carregarListas = useCallback(() => {
    setListas(getLists());
    setListasCarregadas(true);
  }, []);

  return (
    <ListsContext.Provider
      value={{ listas, carregarListas, setListas, listasCarregadas }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export const useLists = () => useContext(ListsContext);
