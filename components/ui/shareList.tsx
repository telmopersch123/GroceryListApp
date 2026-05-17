import { TypeListRenderHome } from "@/app/types/typesGlobal";
import { Share } from "react-native";

export function ShareList(lista: TypeListRenderHome) {
  const itens = lista.itens
    .map((item, index) => `${index + 1} - ${item.name}`)
    .join("\n");

  const mensagem = `📋 ${lista.name}\n\n${itens}`;
  Share.share({ message: mensagem });
}
