"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IntroForm } from "@/components/moodboard/intro-form";
import { MascotStep } from "@/components/moodboard/mascot-step";
import { PaletteStep } from "@/components/moodboard/palette-step";
import { ProgressBar } from "@/components/moodboard/progress-bar";
import { QuestionsStep } from "@/components/moodboard/questions-step";
import { StyleStep } from "@/components/moodboard/style-step";
import { SummaryStep } from "@/components/moodboard/summary-step";
import { WelcomeScreen } from "@/components/moodboard/welcome-screen";
import { RoundedButton } from "@/components/rounded-button";
import { brandQuestions } from "@/content/brand-questions";
import { createSubmission, getContent } from "@/lib/api";
import type {
  ContentResponse,
  Palette,
  Reference,
  SubmissionAnswer,
} from "@/lib/types";

type Stage = "welcome" | "intro" | "quiz" | "sent";

const steps = [
  {
    name: "Estilos visuales",
    title: "¿Qué estilo visual te gusta?",
    eyebrow: "PASO 1",
  },
  {
    name: "Colores",
    title: "¿Qué colores imaginas para tu marca?",
    eyebrow: "PASO 2",
  },
  {
    name: "Mascota",
    title: "¿Tu marca tendrá una mascota?",
    eyebrow: "PASO 3",
  },
  {
    name: "Tu marca",
    title: "Cuéntanos un poquito más",
    eyebrow: "PASO 4",
  },
  {
    name: "Resumen",
    title: "Así se empieza a ver tu marca",
    eyebrow: "RESUMEN",
  },
];

function toSnapshot(reference: Reference) {
  return {
    id: reference.id,
    src: reference.src,
    alt: reference.alt,
    kind: reference.kind,
    category: reference.category,
  };
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [step, setStep] = useState(0);

  const [content, setContent] = useState<ContentResponse | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState<string | null>(null);

  const [brandName, setBrandName] = useState("");
  const [personName, setPersonName] = useState("");

  const [selectedReferences, setSelectedReferences] = useState<string[]>([]);
  const [selectedPalettes, setSelectedPalettes] = useState<string[]>([]);
  const [wantsMascot, setWantsMascot] = useState<boolean | null>(null);
  const [selectedMascotReferences, setSelectedMascotReferences] = useState<
    string[]
  >([]);
  const [brandAnswers, setBrandAnswers] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setContentLoading(true);
    setContentError(null);
    try {
      const data = await getContent();
      setContent(data);
    } catch (error) {
      setContentError(
        error instanceof Error
          ? error.message
          : "No pudimos cargar el contenido.",
      );
    } finally {
      setContentLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage, step]);

  const styleReferences = useMemo(
    () => content?.references.filter((reference) => reference.kind === "style") ?? [],
    [content],
  );

  const mascotReferences = useMemo(
    () =>
      content?.references.filter((reference) => reference.kind === "mascot") ?? [],
    [content],
  );

  const palettes = useMemo(() => content?.palettes ?? [], [content]);

  const answeredQuestions = useMemo<SubmissionAnswer[]>(
    () =>
      brandQuestions
        .map((question) => ({
          id: question.id,
          question: question.question,
          answer: (brandAnswers[question.id] ?? "").trim(),
        }))
        .filter((answer) => answer.answer.length > 0),
    [brandAnswers],
  );

  const canContinue = useMemo(() => {
    if (step === 0) {
      return selectedReferences.length > 0;
    }
    if (step === 1) {
      return selectedPalettes.length > 0;
    }
    if (step === 2) {
      return (
        wantsMascot === false ||
        (wantsMascot === true && selectedMascotReferences.length > 0)
      );
    }
    if (step === 3) {
      return answeredQuestions.length > 0;
    }
    return true;
  }, [
    step,
    selectedReferences.length,
    selectedPalettes.length,
    wantsMascot,
    selectedMascotReferences.length,
    answeredQuestions.length,
  ]);

  const hint = useMemo(() => {
    if (canContinue) {
      return null;
    }
    if (step === 0) {
      return "Selecciona al menos una imagen para continuar.";
    }
    if (step === 1) {
      return "Selecciona al menos una paleta para continuar.";
    }
    if (step === 2) {
      return "Elige al menos una referencia de mascota o la opción «No quiero mascota».";
    }
    if (step === 3) {
      return "Responde al menos una pregunta para continuar.";
    }
    return null;
  }, [canContinue, step]);

  const toggleReference = (id: string) => {
    setSelectedReferences((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const togglePalette = (id: string) => {
    setSelectedPalettes((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleMascot = (id: string) => {
    setWantsMascot(true);
    setSelectedMascotReferences((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const chooseNoMascot = () => {
    setWantsMascot(false);
    setSelectedMascotReferences([]);
  };

  const updateAnswer = (id: string, value: string) => {
    setBrandAnswers((current) => ({ ...current, [id]: value }));
  };

  const selectedStyleReferences = useMemo(() => {
    const byId = new Map(
      styleReferences.map((reference) => [reference.id, reference]),
    );
    return selectedReferences
      .map((id) => byId.get(id))
      .filter((reference): reference is Reference => Boolean(reference));
  }, [selectedReferences, styleReferences]);

  const selectedPaletteData = useMemo(() => {
    const byId = new Map(palettes.map((palette) => [palette.id, palette]));
    return selectedPalettes
      .map((id) => byId.get(id))
      .filter((palette): palette is Palette => Boolean(palette));
  }, [selectedPalettes, palettes]);

  const selectedMascotData = useMemo(() => {
    const byId = new Map(
      mascotReferences.map((reference) => [reference.id, reference]),
    );
    return selectedMascotReferences
      .map((id) => byId.get(id))
      .filter((reference): reference is Reference => Boolean(reference));
  }, [selectedMascotReferences, mascotReferences]);

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    if (
      selectedStyleReferences.length === 0 ||
      selectedPaletteData.length === 0 ||
      answeredQuestions.length === 0
    ) {
      setSubmitError(
        "Falta completar alguna sección. Revisa tus selecciones antes de enviar.",
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createSubmission({
        brandName,
        personName,
        selectedReferences: selectedStyleReferences.map(toSnapshot),
        selectedPalettes: selectedPaletteData.map((palette) => ({
          id: palette.id,
          family: palette.family,
          name: palette.name,
          colors: palette.colors,
        })),
        wantsMascot: wantsMascot === true,
        mascotReferences:
          wantsMascot === true ? selectedMascotData.map(toSnapshot) : [],
        answers: answeredQuestions,
      });

      setSubmittedId(result.id);
      setStage("sent");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No pudimos enviar tus respuestas. Inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = () => {
    if (!canContinue || submitting) {
      return;
    }
    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    void handleSubmit();
  };

  const resetExperience = () => {
    setStage("welcome");
    setStep(0);
    setBrandName("");
    setPersonName("");
    setSelectedReferences([]);
    setSelectedPalettes([]);
    setWantsMascot(null);
    setSelectedMascotReferences([]);
    setBrandAnswers({});
    setSubmitError(null);
    setSubmittedId(null);
  };

  if (stage === "welcome") {
    return <WelcomeScreen onStart={() => setStage("intro")} />;
  }

  if (stage === "intro") {
    return (
      <IntroForm
        onContinue={({ brandName: brand, personName: person }) => {
          setBrandName(brand);
          setPersonName(person);
          setStep(0);
          setStage("quiz");
        }}
        contentReady={Boolean(content)}
        contentLoading={contentLoading}
        contentError={contentError}
        onRetryContent={() => void loadContent()}
      />
    );
  }

  if (stage === "sent") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FEFBF5] px-4 py-8 sm:px-8">
        <section className="w-full max-w-[760px] rounded-[34px] bg-white p-8 text-center shadow-[0_18px_70px_rgba(80,62,42,0.10)] sm:p-14">
          <div
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#F3EAF9] text-4xl text-[#A970CE]"
            aria-hidden="true"
          >
            ✓
          </div>
          <h1 className="mt-6 font-[Made_Tommy_Soft] text-4xl font-bold text-[#FD73A4] sm:text-5xl">
            ¡Listo, {personName}!
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#503E2A] sm:text-lg">
            Recibimos la información de <strong>{brandName}</strong>. Ya tenemos
            tus referencias, paletas y respuestas guardadas para empezar a
            construir la identidad visual.
          </p>
          {submittedId && (
            <p className="mt-6 inline-flex rounded-full bg-[#FEFBF7] px-4 py-2 text-sm font-medium text-[#503E2A]/70">
              Folio: {submittedId.slice(0, 8)}
            </p>
          )}
          <div className="mt-8 flex justify-center">
            <RoundedButton
              className="min-h-14 rounded-full px-10 text-lg font-bold"
              onClick={resetExperience}
            >
              Volver al inicio
            </RoundedButton>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFBF5]">
      <ProgressBar current={step} total={steps.length} />

      <main className="card mx-auto my-8 w-[calc(100%-2rem)] max-w-[1120px] overflow-hidden rounded-[34px] bg-white shadow-[0_18px_60px_rgba(80,62,42,0.08)] sm:my-14">
        <div className="card-body p-5 sm:p-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#503E2A]">
            {steps[step].eyebrow}
          </p>
          <h1 className="font-[Made_Tommy_Soft] text-4xl font-bold leading-none text-[#FD73A4] sm:text-6xl">
            {steps[step].title}
          </h1>

          {step === 0 && (
            <StyleStep
              references={styleReferences}
              selected={selectedReferences}
              onToggle={toggleReference}
            />
          )}

          {step === 1 && (
            <PaletteStep
              palettes={palettes}
              selected={selectedPalettes}
              onToggle={togglePalette}
            />
          )}

          {step === 2 && (
            <MascotStep
              mascots={mascotReferences}
              wantsMascot={wantsMascot}
              selected={selectedMascotReferences}
              onNoMascot={chooseNoMascot}
              onToggle={toggleMascot}
            />
          )}

          {step === 3 && (
            <QuestionsStep
              questions={brandQuestions}
              answers={brandAnswers}
              onChange={updateAnswer}
            />
          )}

          {step === 4 && (
            <SummaryStep
              brandName={brandName}
              personName={personName}
              references={selectedStyleReferences}
              palettes={selectedPaletteData}
              wantsMascot={wantsMascot}
              mascotReferences={selectedMascotData}
              answers={answeredQuestions}
            />
          )}

          {submitError && (
            <div
              role="alert"
              className="mt-6 rounded-[22px] border border-[#F3C6D6] bg-[#FFF3F7] px-5 py-4 text-sm font-medium text-[#503E2A]"
            >
              {submitError}
            </div>
          )}

          <div className="mt-7 flex justify-between gap-3">
            <RoundedButton
              variant="soft"
              className="w-[46%] sm:w-auto"
              disabled={step === 0 || submitting}
              onClick={() => setStep((current) => current - 1)}
            >
              ← Anterior
            </RoundedButton>
            <RoundedButton
              className="w-[46%] sm:w-auto"
              disabled={!canContinue || submitting}
              onClick={goNext}
            >
              {step === steps.length - 1 ? (
                submitting ? (
                  "Enviando…"
                ) : (
                  "Enviar mis respuestas"
                )
              ) : (
                <>
                  Siguiente <span aria-hidden="true">→</span>
                </>
              )}
            </RoundedButton>
          </div>

          {hint && (
            <p
              className="mt-3 text-center text-sm font-medium text-[#503E2A]/60"
              role="status"
            >
              {hint}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
