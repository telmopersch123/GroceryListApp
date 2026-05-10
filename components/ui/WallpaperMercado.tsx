import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Circle, G, Line, Path, Polygon } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const S = "#337539";
const O = 0.14;
const SW = 1.8;

const CELL_SIZE = 110;

/* ================= ICONES ================= */

function Sacola() {
  return (
    <>
      <Path
        fill="none"
        stroke={S}
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
      />
      <Line
        stroke={S}
        strokeWidth={SW}
        strokeLinecap="round"
        x1="3"
        y1="6"
        x2="21"
        y2="6"
      />
      <Path
        fill="none"
        stroke={S}
        strokeWidth={SW}
        strokeLinecap="round"
        d="M16 10a4 4 0 01-8 0"
      />
    </>
  );
}

function Carrinho() {
  return (
    <>
      <Circle fill="none" stroke={S} strokeWidth={SW} cx="9" cy="21" r="1" />
      <Circle fill="none" stroke={S} strokeWidth={SW} cx="20" cy="21" r="1" />
      <Path
        fill="none"
        stroke={S}
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"
      />
    </>
  );
}

function Etiqueta() {
  return (
    <Path
      fill="none"
      stroke={S}
      strokeWidth={SW}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
    />
  );
}

function Estrela() {
  return (
    <Polygon
      fill="none"
      stroke={S}
      strokeWidth={SW}
      strokeLinecap="round"
      strokeLinejoin="round"
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
    />
  );
}

function Fruta() {
  return (
    <>
      <Circle fill="none" stroke={S} strokeWidth={SW} cx="8" cy="14" r="3" />
      <Circle fill="none" stroke={S} strokeWidth={SW} cx="14" cy="14" r="3" />
      <Circle fill="none" stroke={S} strokeWidth={SW} cx="11" cy="9" r="3" />
      <Circle fill="none" stroke={S} strokeWidth={SW} cx="6" cy="9" r="3" />
      <Circle fill="none" stroke={S} strokeWidth={SW} cx="16" cy="9" r="3" />
      <Path
        fill="none"
        stroke={S}
        strokeWidth={SW}
        strokeLinecap="round"
        d="M11 6V3M9 3h4"
      />
    </>
  );
}

function Globo() {
  return (
    <>
      <Circle fill="none" stroke={S} strokeWidth={SW} cx="12" cy="12" r="9" />
      <Path
        fill="none"
        stroke={S}
        strokeWidth={SW}
        strokeLinecap="round"
        d="M12 3c0 0-3 4-3 9s3 9 3 9M12 3c0 0 3 4 3 9s-3 9-3 9M3 12h18"
      />
    </>
  );
}

const icons = [Sacola, Carrinho, Etiqueta, Estrela, Fruta, Globo];

/* ================= RANDOM FIXO ================= */

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/* ================= WALLPAPER ================= */

export function WallpaperMercado() {
  const wallpaper = useMemo(() => {
    const cols = Math.ceil(width / CELL_SIZE);
    const rows = Math.ceil(height / CELL_SIZE);

    const items = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const seed = row * 100 + col;

        const iconIndex = Math.floor(seededRandom(seed) * icons.length);

        const Icon = icons[iconIndex];

        const x = col * CELL_SIZE + seededRandom(seed + 1) * 50;

        const y = row * CELL_SIZE + seededRandom(seed + 2) * 50;

        const rotate = seededRandom(seed + 3) * 50 - 25;

        const scale = 0.85 + seededRandom(seed + 4) * 0.35;

        items.push(
          <G
            key={`${row}-${col}`}
            opacity={O}
            transform={`
              translate(${x}, ${y})
              rotate(${rotate})
              scale(${scale})
            `}
          >
            <Icon />
          </G>
        );
      }
    }

    return items;
  }, []);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg width="100%" height="100%">
        {wallpaper}
      </Svg>
    </View>
  );
}
