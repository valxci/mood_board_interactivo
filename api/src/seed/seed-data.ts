import type { ColorSwatch } from "../common/types";

export const seedStyleReferences = [
  "image 5.png",
  "image 6.png",
  "image 7.png",
  "image 8.png",
  "image 9.png",
  "image 10.png",
  "image 11.png",
  "image 12.png",
  "image 13.png",
  "image 14.png",
  "reference-17.png",
  "reference-18.png",
  "reference-19.png",
  "reference-20.png",
  "reference-21.png",
  "reference-22.png",
  "reference-23.png",
  "reference-24.png",
  "reference-25.png",
  "reference-26.png",
  "reference-27.png",
  "reference-28.png",
  "reference-29.png",
  "reference-30.png",
  "reference-31.png",
  "reference-32.png",
  "reference-33.png",
].map((filename) => `/references/${filename}`);

export const seedMascotReferences = Array.from(
  { length: 10 },
  (_, index) => `/mascot-references/mascot-${index + 1}.png`,
);

export type SeedPalette = {
  family: string;
  name: string;
  colors: ColorSwatch[];
};

export const seedPalettes: SeedPalette[] = [
  {
    family: "Coloridas y vibrantes",
    name: "Paleta 1",
    colors: [
      { name: "Lime cream", hex: "#D9FB5F" },
      { name: "Hot pink", hex: "#FF66A9" },
      { name: "Princeton orange", hex: "#FE8616" },
      { name: "Majorelle blue", hex: "#7B46F8" },
      { name: "Aqua pop", hex: "#20C9C3" },
    ],
  },
  {
    family: "Coloridas y vibrantes",
    name: "Paleta 2",
    colors: [
      { name: "Bubblegum", hex: "#FF477E" },
      { name: "Tangerine", hex: "#FF9F1C" },
      { name: "Lemon pop", hex: "#FFD93D" },
      { name: "Grape candy", hex: "#A66CFF" },
      { name: "Mint splash", hex: "#45D6B5" },
    ],
  },
  {
    family: "Tropicales y frutales",
    name: "Paleta 1",
    colors: [
      { name: "Jungle green", hex: "#087F5B" },
      { name: "Pineapple green", hex: "#B7C94B" },
      { name: "Sunshine", hex: "#FFC928" },
      { name: "Mango orange", hex: "#FF793F" },
      { name: "Guava pink", hex: "#F0447D" },
    ],
  },
  {
    family: "Tropicales y frutales",
    name: "Paleta 2",
    colors: [
      { name: "Summer yellow", hex: "#F9AF08" },
      { name: "Mango orange", hex: "#F06707" },
      { name: "Dragon fruit", hex: "#FD777A" },
      { name: "Berry pink", hex: "#E11C8A" },
      { name: "Kiwi green", hex: "#9BCA3B" },
    ],
  },
  {
    family: "Dulces y cute",
    name: "Paleta 1",
    colors: [
      { name: "Strawberry milk", hex: "#F7A8C4" },
      { name: "Pink frosting", hex: "#FF6F91" },
      { name: "Lavender", hex: "#D8B4F8" },
      { name: "Vanilla cream", hex: "#FFF0B3" },
      { name: "Mint candy", hex: "#A8DCCB" },
    ],
  },
  {
    family: "Dulces y cute",
    name: "Paleta 2",
    colors: [
      { name: "Cotton pink", hex: "#FFB6D5" },
      { name: "Sugar violet", hex: "#B9A0F5" },
      { name: "Blue raspberry", hex: "#91D9E8" },
      { name: "Peach sugar", hex: "#FFE08A" },
      { name: "Creamy peach", hex: "#F5C9B8" },
    ],
  },
  {
    family: "Refrescantes y acuáticas",
    name: "Paleta 1",
    colors: [
      { name: "Ice blue", hex: "#45C6D9" },
      { name: "Aqua mint", hex: "#8DE3DC" },
      { name: "Lime ice", hex: "#B5E85B" },
      { name: "Blue raspberry", hex: "#65A8ED" },
      { name: "Snow cream", hex: "#F4F4E8" },
    ],
  },
  {
    family: "Refrescantes y acuáticas",
    name: "Paleta 2",
    colors: [
      { name: "Ocean blue", hex: "#087EBA" },
      { name: "Turquoise", hex: "#00BFA6" },
      { name: "Glacier", hex: "#76D7EA" },
      { name: "Lemon lime", hex: "#D3F36B" },
      { name: "Pineapple", hex: "#FFCA65" },
    ],
  },
  {
    family: "Cítricas y energéticas",
    name: "Paleta 1",
    colors: [
      { name: "Lemon zest", hex: "#D5E928" },
      { name: "Lime green", hex: "#A6C936" },
      { name: "Sun yellow", hex: "#FFCA28" },
      { name: "Orange zest", hex: "#FF8C24" },
      { name: "Blood orange", hex: "#F45B35" },
    ],
  },
  {
    family: "Cítricas y energéticas",
    name: "Paleta 2",
    colors: [
      { name: "Mango sun", hex: "#FFB02E" },
      { name: "Papaya", hex: "#FF7A45" },
      { name: "Watermelon", hex: "#F45168" },
      { name: "Berry juice", hex: "#D93682" },
      { name: "Purple grape", hex: "#9B4DCA" },
    ],
  },
  {
    family: "Cremosas y apetitosas",
    name: "Paleta 1",
    colors: [
      { name: "Vanilla", hex: "#FFF0CF" },
      { name: "Peach cream", hex: "#F5C18A" },
      { name: "Caramel", hex: "#D99A70" },
      { name: "Strawberry", hex: "#E9A8BE" },
      { name: "Pistachio", hex: "#B7C99A" },
    ],
  },
  {
    family: "Cremosas y apetitosas",
    name: "Paleta 2",
    colors: [
      { name: "Peach pink", hex: "#F6A6A1" },
      { name: "Mango cream", hex: "#F8C96D" },
      { name: "Matcha", hex: "#B5CFA5" },
      { name: "Ube purple", hex: "#C7A5DD" },
      { name: "Oat milk", hex: "#F3E2CB" },
    ],
  },
  {
    family: "Retro y divertidas",
    name: "Paleta 1",
    colors: [
      { name: "Coral red", hex: "#F05A47" },
      { name: "Mustard", hex: "#F4B942" },
      { name: "Retro mint", hex: "#79B7A0" },
      { name: "Denim blue", hex: "#5877B7" },
      { name: "Vanilla beige", hex: "#F2D8B3" },
    ],
  },
  {
    family: "Retro y divertidas",
    name: "Paleta 2",
    colors: [
      { name: "Retro pink", hex: "#EA5D8F" },
      { name: "Orange soda", hex: "#F28E2B" },
      { name: "Lemon soda", hex: "#E8CE48" },
      { name: "Vintage green", hex: "#628C78" },
      { name: "Grape soda", hex: "#8E75B8" },
    ],
  },
];
