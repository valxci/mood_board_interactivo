import type { ColorSwatch, SubmissionAnalysis } from "../common/types";
import type { CreateSubmissionDto } from "./dto/create-submission.dto";

export function buildAnalysis(dto: CreateSubmissionDto): SubmissionAnalysis {
  const categoryCounts = new Map<string, number>();
  for (const reference of dto.selectedReferences) {
    const key = reference.category?.trim() || "Sin categoría";
    categoryCounts.set(key, (categoryCounts.get(key) ?? 0) + 1);
  }

  const colorCounts = new Map<string, { color: ColorSwatch; count: number }>();
  for (const palette of dto.selectedPalettes) {
    for (const color of palette.colors) {
      const key = color.hex.toUpperCase();
      const entry = colorCounts.get(key) ?? {
        color: { name: color.name, hex: key },
        count: 0,
      };
      entry.count += 1;
      colorCounts.set(key, entry);
    }
  }

  const dominantColors = [...colorCounts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((entry) => entry.color);

  const styleCategories = [...categoryCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const answeredQuestions = dto.answers.filter(
    (answer) => answer.answer.trim().length > 0,
  ).length;

  const namedCategories = styleCategories.filter(
    (category) => category.name !== "Sin categoría",
  );

  const summary: string[] = [];

  summary.push(
    `${dto.brandName} eligió ${dto.selectedReferences.length} referencias visuales y ${dto.selectedPalettes.length} paletas de color.`,
  );

  if (namedCategories.length === 1) {
    summary.push(
      `El estilo predominante es «${namedCategories[0].name}» (${namedCategories[0].count} de ${dto.selectedReferences.length} referencias).`,
    );
  } else if (namedCategories.length > 1) {
    summary.push(
      `Combina varios estilos: ${namedCategories
        .map((category) => `${category.name} (${category.count})`)
        .join(", ")}.`,
    );
  }

  if (dominantColors.length > 0) {
    summary.push(
      `Los colores con más presencia son ${dominantColors
        .slice(0, 5)
        .map((color) => `${color.name} (${color.hex})`)
        .join(", ")}.`,
    );
  }

  summary.push(
    dto.wantsMascot
      ? `Quiere incluir una mascota y eligió ${dto.mascotReferences.length} referencias para ella.`
      : "Prefiere una marca sin mascota.",
  );

  summary.push(
    answeredQuestions > 0
      ? `Respondió ${answeredQuestions} de ${dto.answers.length} preguntas abiertas.`
      : "Todavía no dejó respuestas en las preguntas abiertas.",
  );

  return {
    headline: `${dto.brandName} · ${dto.selectedReferences.length} referencias · ${dto.selectedPalettes.length} paletas`,
    summary,
    stats: {
      references: dto.selectedReferences.length,
      palettes: dto.selectedPalettes.length,
      mascots: dto.mascotReferences.length,
      answeredQuestions,
      totalQuestions: dto.answers.length,
      uniqueColors: colorCounts.size,
    },
    styleCategories,
    dominantColors,
    mascot: { wants: dto.wantsMascot, count: dto.mascotReferences.length },
  };
}
