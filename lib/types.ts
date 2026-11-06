export type ColorSwatch = {
  name: string;
  hex: string;
};

export type ReferenceKind = "style" | "mascot";

export type Reference = {
  id: string;
  kind: ReferenceKind;
  src: string;
  alt: string;
  category: string | null;
  sortOrder?: number;
  createdAt?: string;
};

export type Palette = {
  id: string;
  family: string;
  name: string;
  colors: ColorSwatch[];
  sortOrder?: number;
  createdAt?: string;
};

export type ContentResponse = {
  references: Reference[];
  palettes: Palette[];
};

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

export type Submission = {
  id: string;
  brandName: string;
  personName: string;
  selectedReferences: ReferenceSnapshot[];
  selectedPalettes: PaletteSnapshot[];
  wantsMascot: boolean;
  mascotReferences: ReferenceSnapshot[];
  answers: SubmissionAnswer[];
  analysis: SubmissionAnalysis;
  adminNotes: string;
  createdAt: string;
};

export type CreateSubmissionPayload = {
  brandName: string;
  personName: string;
  selectedReferences: ReferenceSnapshot[];
  selectedPalettes: PaletteSnapshot[];
  wantsMascot: boolean;
  mascotReferences: ReferenceSnapshot[];
  answers: SubmissionAnswer[];
};
