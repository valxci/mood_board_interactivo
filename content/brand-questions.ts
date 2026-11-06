export type BrandQuestion = {
  id: string;
  question: string;
  description?: string;
  placeholder: string;
};

export const brandQuestions: BrandQuestion[] = [
  {
    id: "mustHave",
    question: "¿Hay algo que definitivamente quieras que tenga tu marca?",
    description:
      "Puede ser un símbolo, un elemento gráfico, un concepto, un objeto o alguna idea que tengas en mente.",
    placeholder: "Cuéntanos qué elementos te gustaría incluir...",
  },
  {
    id: "avoid",
    question: "¿Hay algo que NO te gustaría ver en tu marca?",
    description: "Queremos conocer también aquello con lo que no te identificas.",
    placeholder: "Cuéntanos qué preferirías evitar...",
  },
  {
    id: "feelings",
    question:
      "¿Qué te gustaría que las personas sintieran o pensaran al ver tu marca?",
    description:
      "Por ejemplo: confianza, alegría, cercanía, elegancia, creatividad, tranquilidad...",
    placeholder: "Escribe las emociones o ideas que quieres transmitir...",
  },
  {
    id: "inspiration",
    question: "¿Hay alguna marca, diseño o referencia que te inspire?",
    description: "Si tienes alguna, puedes compartirnos su nombre o un enlace.",
    placeholder: "Comparte marcas, diseños o enlaces de referencia...",
  },
  {
    id: "extra",
    question: "¿Hay algo más que quisieras que tuviéramos en cuenta?",
    description:
      "¡Este espacio es completamente tuyo! Cuéntanos cualquier idea, expectativa o detalle que consideres importante para construir tu marca.",
    placeholder: "Aquí puedes contarnos cualquier detalle adicional...",
  },
];
