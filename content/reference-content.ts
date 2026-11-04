export type ReferenceCategory = {
  id: string;
  name: string;
  description: string;
  references: ReferenceImage[];
};

export type ReferenceImage = {
  id: string;
  src: string;
  alt: string;
};

export const referenceCategories: ReferenceCategory[] = [
  { id: "maximalista", name: "Maximalista", description: "Identidades expresivas, atrevidas, coloridas y llenas de elementos gráficos.", references: [] },
  { id: "minimalista", name: "Minimalista", description: "Identidades limpias, sencillas, equilibradas y con pocos elementos.", references: [] },
  { id: "geometrico", name: "Geométrico", description: "Formas, estructuras, líneas y composiciones geométricas.", references: [] },
  { id: "organico", name: "Orgánico", description: "Formas naturales, trazos libres, curvas y elementos ilustrativos.", references: [] },
  { id: "editorial", name: "Tipográfico/editorial", description: "Protagonismo de las letras, composiciones tipográficas y juegos de fuentes.", references: [] },
];

export type ColorPalette = {
  id: string;
  name: string;
  colors: string[];
};

export const colorPalettes: ColorPalette[] = [];
