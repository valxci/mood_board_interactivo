"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ApiError,
  assetUrl,
  deleteSubmission,
  getSubmissions,
  saveSubmissionNotes,
} from "@/lib/api";
import type { Submission } from "@/lib/types";

type ProjectsPanelProps = {
  token: string;
  onUnauthorized: () => void;
};

function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#FFF3F7] px-3 py-1.5 text-xs font-bold text-[#503E2A]">
      {children}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A970CE]">
        {eyebrow}
      </p>
      <h3 className="mt-1 font-[Made_Tommy_Soft] text-2xl font-bold text-[#503E2A]">
        {children}
      </h3>
    </div>
  );
}

export function ProjectsPanel({ token, onUnauthorized }: ProjectsPanelProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesMessage, setNotesMessage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSubmissions(token);
      setSubmissions(data);
    } catch (loadError) {
      if (isUnauthorized(loadError)) {
        onUnauthorized();
        return;
      }
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No pudimos cargar las marcas.",
      );
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = useMemo(
    () => submissions.find((item) => item.id === selectedId) ?? null,
    [selectedId, submissions],
  );

  const handleSaveNotes = async () => {
    if (!selected || savingNotes) {
      return;
    }
    setSavingNotes(true);
    setNotesMessage(null);
    try {
      const updated = await saveSubmissionNotes(token, selected.id, notes);
      setSubmissions((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setNotesMessage("Notas guardadas.");
    } catch (saveError) {
      if (isUnauthorized(saveError)) {
        onUnauthorized();
        return;
      }
      setNotesMessage(
        saveError instanceof Error
          ? saveError.message
          : "No pudimos guardar las notas.",
      );
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || deleting) {
      return;
    }
    if (
      !window.confirm(
        `¿Eliminar definitivamente la solicitud de ${selected.brandName}?`,
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await deleteSubmission(token, selected.id);
      setSubmissions((current) =>
        current.filter((item) => item.id !== selected.id),
      );
      setSelectedId(null);
    } catch (deleteError) {
      if (isUnauthorized(deleteError)) {
        onUnauthorized();
        return;
      }
      setNotesMessage(
        deleteError instanceof Error
          ? deleteError.message
          : "No pudimos eliminar la solicitud.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = () => {
    if (!selected) {
      return;
    }
    const blob = new Blob([JSON.stringify(selected, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const slug = selected.brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    link.href = url;
    link.download = `${slug || "marca"}-moodboard.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <p role="status" className="text-sm font-bold text-[#503E2A]/70">
        Cargando marcas…
      </p>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col gap-3 rounded-[24px] border border-[#F3C6D6] bg-[#FFF3F7] p-6 text-sm text-[#503E2A] sm:flex-row sm:items-center sm:justify-between"
      >
        <span>{error}</span>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-full bg-[#FD73A4] px-5 py-2 font-bold text-white hover:bg-[#EC6294]"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!selected) {
    return (
      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A970CE]">
              Solicitudes recibidas
            </p>
            <h2 className="mt-1 font-[Made_Tommy_Soft] text-3xl font-bold text-[#503E2A] sm:text-4xl">
              Carpetas de marcas
            </h2>
          </div>
          <StatChip>
            {submissions.length}{" "}
            {submissions.length === 1 ? "marca" : "marcas"}
          </StatChip>
        </div>

        {submissions.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#E7D9D2] bg-white p-10 text-center">
            <p className="font-[Made_Tommy_Soft] text-2xl font-bold text-[#503E2A]">
              Todavía no hay marcas
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#503E2A]/70">
              Cuando alguien complete la experiencia, su información aparecerá
              aquí con sus referencias, paletas, respuestas y análisis.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {submissions.map((submission) => (
              <button
                key={submission.id}
                type="button"
                onClick={() => {
                  setNotes(submission.adminNotes);
                  setNotesMessage(null);
                  setSelectedId(submission.id);
                }}
                className="group relative overflow-hidden rounded-[28px] border border-[#F0DDD9] bg-white p-6 text-left transition-all hover:-translate-y-1 hover:border-[#F3C6D6] hover:shadow-[0_14px_36px_rgba(80,62,42,0.12)]"
              >
                <span
                  className="absolute inset-x-0 top-0 h-2 bg-[#FD73A4]"
                  aria-hidden="true"
                />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-8 w-8 text-[#A970CE]"
                  aria-hidden="true"
                >
                  <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4l2 2.5h7A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />
                </svg>
                <h3 className="mt-4 font-[Made_Tommy_Soft] text-2xl font-bold leading-tight text-[#503E2A]">
                  {submission.brandName}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#503E2A]/70">
                  {submission.personName} · {formatDate(submission.createdAt)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatChip>{submission.analysis.stats.references} refs.</StatChip>
                  <StatChip>{submission.analysis.stats.palettes} paletas</StatChip>
                  <StatChip>
                    {submission.analysis.mascot.wants ? "Con mascota" : "Sin mascota"}
                  </StatChip>
                </div>
                <span className="mt-5 inline-block text-sm font-bold text-[#A970CE]">
                  Abrir carpeta →
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    );
  }

  const { analysis } = selected;

  return (
    <section className="space-y-6">
      <button
        type="button"
        onClick={() => setSelectedId(null)}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#A970CE] hover:text-[#8A55B0]"
      >
        ← Todas las marcas
      </button>

      <header className="rounded-[28px] border border-[#F0DDD9] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A970CE]">
              Carpeta de marca
            </p>
            <h2 className="mt-2 font-[Made_Tommy_Soft] text-4xl font-bold leading-none text-[#FD73A4] sm:text-5xl">
              {selected.brandName}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#503E2A]/70">
              Creada por {selected.personName} · {formatDate(selected.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-full border border-[#E7D9D2] px-4 py-2 text-xs font-bold text-[#503E2A] hover:bg-[#FFF3F7]"
            >
              Descargar JSON
            </button>
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={deleting}
              className="rounded-full border border-[#F3C6D6] px-4 py-2 text-xs font-bold text-[#D9416F] hover:bg-[#FFF3F7] disabled:opacity-50"
            >
              {deleting ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <StatChip>{analysis.stats.references} referencias</StatChip>
          <StatChip>{analysis.stats.palettes} paletas</StatChip>
          <StatChip>{analysis.stats.uniqueColors} colores únicos</StatChip>
          <StatChip>
            {analysis.stats.answeredQuestions}/{analysis.stats.totalQuestions}{" "}
            respuestas
          </StatChip>
          <StatChip>
            {analysis.mascot.wants
              ? `Mascota · ${analysis.mascot.count} refs.`
              : "Sin mascota"}
          </StatChip>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-[#F0DDD9] bg-white p-6 sm:p-8">
          <SectionTitle eyebrow="Análisis automático">Lectura de la marca</SectionTitle>
          <ul className="space-y-3">
            {analysis.summary.map((line, index) => (
              <li
                key={index}
                className="flex gap-3 text-sm leading-6 text-[#503E2A] sm:text-base sm:leading-7"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FD73A4]" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {analysis.styleCategories.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#503E2A]/60">
                Categorías de estilo
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {analysis.styleCategories.map((category) => (
                  <StatChip key={category.name}>
                    {category.name} · {category.count}
                  </StatChip>
                ))}
              </div>
            </div>
          )}

          {analysis.dominantColors.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#503E2A]/60">
                Colores con más presencia
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {analysis.dominantColors.map((color) => (
                  <div
                    key={color.hex}
                    className="flex items-center gap-2 rounded-full border border-[#F0DDD9] bg-[#FEFBF7] py-1 pl-1 pr-3"
                  >
                    <span
                      className="h-7 w-7 rounded-full border border-black/5"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-bold text-[#503E2A]">
                      {color.name}
                    </span>
                    <span className="text-[10px] font-medium uppercase text-[#503E2A]/60">
                      {color.hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7">
            <label
              htmlFor="admin-notes"
              className="text-xs font-bold uppercase tracking-[0.14em] text-[#503E2A]/60"
            >
              Notas internas
            </label>
            <textarea
              id="admin-notes"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Ideas, próximos pasos o comentarios sobre esta marca…"
              className="textarea mt-2 min-h-28 w-full rounded-[20px] border-[#E7D9D2] bg-[#FEFBF7] px-4 py-3 text-sm text-[#503E2A] placeholder:text-[#503E2A]/45 focus:border-[#FD73A4] focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void handleSaveNotes()}
                disabled={savingNotes}
                className="rounded-full bg-[#FD73A4] px-5 py-2 text-xs font-bold text-white hover:bg-[#EC6294] disabled:opacity-50"
              >
                {savingNotes ? "Guardando…" : "Guardar notas"}
              </button>
              {notesMessage && (
                <span className="text-xs font-medium text-[#503E2A]/70">
                  {notesMessage}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#F0DDD9] bg-white p-6 sm:p-8">
          <SectionTitle eyebrow="Paso 1">Referencias visuales</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {selected.selectedReferences.map((reference, index) => (
              <div
                key={reference.id}
                className="relative aspect-[4/5] overflow-hidden rounded-[16px] border border-[#F0DDD9] bg-[#FEFBF7]"
              >
                <Image
                  src={assetUrl(reference.src)}
                  alt={reference.alt || `Referencia ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 33vw, 160px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-7">
            <SectionTitle eyebrow="Paso 2">Paletas elegidas</SectionTitle>
            <div className="grid gap-3">
              {selected.selectedPalettes.map((palette) => (
                <div key={palette.id}>
                  <p className="mb-1 text-xs font-bold text-[#503E2A]">
                    {palette.family}{" "}
                    <span className="font-medium text-[#503E2A]/50">
                      · {palette.name}
                    </span>
                  </p>
                  <div className="flex overflow-hidden rounded-[14px]">
                    {palette.colors.map((color) => (
                      <span
                        key={`${palette.id}-${color.hex}`}
                        className="h-12 flex-1"
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} ${color.hex}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <SectionTitle eyebrow="Paso 3">Mascota</SectionTitle>
            {selected.wantsMascot && selected.mascotReferences.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {selected.mascotReferences.map((reference, index) => (
                  <div
                    key={reference.id}
                    className="relative aspect-[4/5] overflow-hidden rounded-[16px] border border-[#F0DDD9] bg-[#FEFBF7]"
                  >
                    <Image
                      src={assetUrl(reference.src)}
                      alt={reference.alt || `Mascota ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 33vw, 160px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="inline-flex rounded-full bg-[#F3EAF9] px-4 py-2 text-xs font-bold text-[#7B5A93]">
                Sin mascota
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-[#F0DDD9] bg-white p-6 sm:p-8">
        <SectionTitle eyebrow="Paso 4">Preguntas abiertas</SectionTitle>
        {selected.answers.length === 0 ? (
          <p className="text-sm text-[#503E2A]/70">
            No dejó respuestas en las preguntas abiertas.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {selected.answers.map((answer, index) => (
              <div
                key={answer.id}
                className="rounded-[20px] border border-[#F0DDD9] bg-[#FEFBF7] p-5"
              >
                <p className="flex gap-2 text-sm font-bold text-[#503E2A]">
                  <span className="text-[#FD73A4]">{index + 1}.</span>
                  <span>{answer.question}</span>
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#503E2A]/80">
                  {answer.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
