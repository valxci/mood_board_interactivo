export type ColorSwatch = {
  name: string;
  hex: string;
};

export type ReferenceKind = "style" | "mascot";

export type ReferenceSnapshot = {
  id: string;
  src: string;
  alt: string;
  kind: string;
  category?: string | null;
};

export type PaletteSnapshot = {
  id: string;
  family: string;
  name: string;
  colors: ColorSwatch[];
};

export type SubmissionAnswer = {
  id: string;
  question: string;
  answer: string;
};

export type SubmissionAnalysis = {
  headline: string;
  summary: string[];
  stats: {
    references: number;
    palettes: number;
    mascots: number;
    answeredQuestions: number;
    totalQuestions: number;
    uniqueColors: number;
  };
  styleCategories: { name: string; count: number }[];
  dominantColors: ColorSwatch[];
  mascot: { wants: boolean; count: number };
};
