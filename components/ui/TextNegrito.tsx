import { Text } from "react-native";

interface Props {
  texto: string;
  style?: any;
  checkedStyle?: any;
}

export function TextComNegrito({ texto, style, checkedStyle }: Props) {
  const partes = texto.split(/(\d+)/);
  return (
    <Text style={[style, checkedStyle]}>
      {partes.map((parte, i) =>
        /^\d+$/.test(parte) ? (
          <Text
            key={i}
            style={[
              style,
              checkedStyle,
              { fontWeight: "bold", fontStyle: "italic" },
            ]}
          >
            {parte}
          </Text>
        ) : (
          <Text key={i}>{parte}</Text>
        )
      )}
    </Text>
  );
}
