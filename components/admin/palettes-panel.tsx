"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ApiError,
  createPalette,
  deletePalette,
  getAdminPalettes,
} from "@/lib/api";
import type { Palette } from "@/lib/types";

type PalettesPanelProps = {
  token: string;
  onUnauthorized: () => void;
};

type ColorRow = {
  id: string;
  name: string;
  hex: string;
};

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

function newRow(name = "", hex = "#FD73A4"): ColorRow {
  return { id: crypto.randomUUID(), name, hex };
}

function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function PalettesPanel({ token, onUnauthorized }: PalettesPanelProps) {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [family, setFamily] = useState("");
  const [name, setName] = useState("");
  const [colors, setColors] = useState<ColorRow[]>([
    newRow("Color 1", "#FD73A4"),
    newRow("Color 2", "#A970CE"),
    newRow("Color 3", "#F9B021"),
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminPalettes(token);
      setPalettes(data);
    } catch (loadError) {
      if (isUnauthorized(loadError)) {
        onUnauthorized();
        return;
      }
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No pudimos cargar las paletas.",
      );
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const families = useMemo(() => {
    const groups: { family: string; palettes: Palette[] }[] = [];
    for (const palette of palettes) {
      const group = groups.find((item) => item.family === palette.family);
      if (group) {
        group.palettes.push(palette);
      } else {
        groups.push({ family: palette.family, palettes: [palette] });
      }
    }
    return groups;
  }, [palettes]);

  const updateColor = (id: string, patch: Partial<ColorRow>) => {
    setColors((current) =>
      current.map((color) => (color.id === id ? { ...color, ...patch } : color)),
    );
  };

  const addColor = () => {
    if (colors.length >= 10) {
      return;
    }
    setColors((current) => [...current, newRow(`Color ${current.length + 1}`)]);
  };

  const removeColor = (id: string) => {
    if (colors.length <= 2) {
      return;
    }
    setColors((current) => current.filter((color) => color.id !== id));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    if (!family.trim()) {
      setFormError("Escribe el nombre de la familia de colores.");
      return;
    }

    const cleanedColors = colors.map((color) => ({
      name: color.name.trim() || color.hex.trim(),
      hex: color.hex.trim().toUpperCase(),
    }));

    if (cleanedColors.some((color) => !HEX_PATTERN.test(color.hex))) {
      setFormError("Todos los colores deben tener un hex válido (#RRGGBB).");
      return;
    }

    const sameFamily = palettes.filter(
      (palette) => palette.family === family.trim(),
    ).length;

    setSubmitting(true);
    setFormError(null);
    setSuccess(null);

    try {
      const created = await createPalette(token, {
        family: family.trim(),
        name: name.trim() || `Paleta ${sameFamily + 1}`,
        colors: cleanedColors,
      });

      setPalettes((current) => [...current, created]);
      setColors([
        newRow("Color 1", "#FD73A4"),
        newRow("Color 2", "#A970CE"),
        newRow("Color 3", "#F9B021"),
      ]);
      setName("");
      setSuccess("Paleta agregada a la experiencia.");
    } catch (createError) {
      if (isUnauthorized(createError)) {
        onUnauthorized();
        return;
      }
      setFormError(
        createError instanceof Error
          ? createError.message
          : "No pudimos crear la paleta.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (palette: Palette) => {
    if (deletingId) {
      return;
    }
    if (
      !window.confirm(
        `¿Eliminar la paleta ${palette.name} de «${palette.family}»?`,
      )
    ) {
      return;
    }

    setDeletingId(palette.id);
    setFormError(null);
    try {
      await deletePalette(token, palette.id);
      setPalettes((current) =>
        current.filter((item) => item.id !== palette.id),
      );
    } catch (deleteError) {
      if (isUnauthorized(deleteError)) {
        onUnauthorized();
        return;
      }
      setFormError(
        deleteError instanceof Error
          ? deleteError.message
          : "No pudimos eliminar la paleta.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A970CE]">
          Biblioteca de color
        </p>
        <h2 className="mt-1 font-[Made_Tommy_Soft] text-3xl font-bold text-[#503E2A] sm:text-4xl">
          Paletas de la experiencia
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#503E2A]/70">
          Crea paletas desde aquí y aparecerán automáticamente en el paso 2. Las
          familias agrupan las paletas que comparten una misma intención.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-[#F0DDD9] bg-white p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-[#503E2A]">
              Familia de colores
            </span>
            <input
              type="text"
              value={family}
              onChange={(event) => setFamily(event.target.value)}
              placeholder="Ej. Coloridas y vibrantes"
              maxLength={120}
              className="input mt-2 h-12 w-full rounded-[18px] border-[#E7D9D2] bg-[#FEFBF7] px-4 text-sm text-[#503E2A] placeholder:text-[#503E2A]/45 focus:border-[#FD73A4] focus:outline-none"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#503E2A]">
              Nombre de la paleta
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Paleta 3 (opcional)"
              maxLength={120}
              className="input mt-2 h-12 w-full rounded-[18px] border-[#E7D9D2] bg-[#FEFBF7] px-4 text-sm text-[#503E2A] placeholder:text-[#503E2A]/45 focus:border-[#FD73A4] focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#503E2A]">
              Colores ({colors.length}/10)
            </p>
            <button
              type="button"
              onClick={addColor}
              disabled={colors.length >= 10}
              className="rounded-full border border-[#E7D9D2] px-4 py-1.5 text-xs font-bold text-[#503E2A] hover:bg-[#FFF3F7] disabled:opacity-40"
            >
              + Agregar color
            </button>
          </div>

          <div className="mt-3 grid gap-3">
            {colors.map((color, index) => (
              <div
                key={color.id}
                className="flex flex-wrap items-center gap-3 rounded-[18px] border border-[#F0DDD9] bg-[#FEFBF7] p-3 sm:flex-nowrap"
              >
                <input
                  type="color"
                  value={HEX_PATTERN.test(color.hex) ? color.hex : "#FD73A4"}
                  onChange={(event) =>
                    updateColor(color.id, { hex: event.target.value })
                  }
                  aria-label={`Color ${index + 1}`}
                  className="h-11 w-14 cursor-pointer rounded-[12px] border border-[#E7D9D2] bg-white p-1"
                />
                <input
                  type="text"
                  value={color.name}
                  onChange={(event) =>
                    updateColor(color.id, { name: event.target.value })
                  }
                  placeholder={`Nombre del color ${index + 1}`}
                  maxLength={80}
                  className="input h-11 min-w-0 flex-1 rounded-[14px] border-[#E7D9D2] bg-white px-3 text-sm text-[#503E2A] placeholder:text-[#503E2A]/45 focus:border-[#FD73A4] focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={color.hex}
                  onChange={(event) =>
                    updateColor(color.id, { hex: event.target.value })
                  }
                  placeholder="#FD73A4"
                  maxLength={7}
                  className="input h-11 w-28 rounded-[14px] border-[#E7D9D2] bg-white px-3 text-sm uppercase text-[#503E2A] focus:border-[#FD73A4] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeColor(color.id)}
                  disabled={colors.length <= 2}
                  aria-label={`Quitar color ${index + 1}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-[#F3C6D6] text-sm font-bold text-[#D9416F] hover:bg-[#FFF3F7] disabled:opacity-30"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {formError && (
          <p
            role="alert"
            className="mt-4 rounded-[18px] border border-[#F3C6D6] bg-[#FFF3F7] px-4 py-3 text-sm font-medium text-[#503E2A]"
          >
            {formError}
          </p>
        )}
        {success && (
          <p
            role="status"
            className="mt-4 rounded-[18px] border border-[#CDEBDD] bg-[#F0FBF5] px-4 py-3 text-sm font-medium text-[#2F6B4F]"
          >
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 rounded-full bg-[#FD73A4] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#EC6294] disabled:opacity-50"
        >
          {submitting ? "Creando…" : "Crear paleta"}
        </button>
      </form>

      {loading ? (
        <p role="status" className="text-sm font-bold text-[#503E2A]/70">
          Cargando paletas…
        </p>
      ) : error ? (
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
      ) : (
        <div className="space-y-7">
          {families.map((group) => (
            <div key={group.family}>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#503E2A]">
                {group.family}
                <span className="rounded-full bg-[#FFF3F7] px-3 py-1 text-xs">
                  {group.palettes.length}
                </span>
              </h3>
              <div className="grid gap-3 lg:grid-cols-2">
                {group.palettes.map((palette) => (
                  <article
                    key={palette.id}
                    className="rounded-[22px] border border-[#F0DDD9] bg-white p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#503E2A]">
                          {palette.name}
                        </p>
                        <p className="text-xs text-[#503E2A]/55">
                          {palette.family}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleDelete(palette)}
                        disabled={deletingId === palette.id}
                        aria-label={`Eliminar ${palette.name}`}
                        className="rounded-full border border-[#F3C6D6] px-3 py-1 text-[11px] font-bold text-[#D9416F] hover:bg-[#FFF3F7] disabled:opacity-50"
                      >
                        {deletingId === palette.id ? "…" : "Eliminar"}
                      </button>
                    </div>
                    <div className="flex overflow-hidden rounded-[14px]">
                      {palette.colors.map((color) => (
                        <div
                          key={`${palette.id}-${color.hex}`}
                          className="flex h-16 flex-1 flex-col justify-end p-1.5"
                          style={{ backgroundColor: color.hex }}
                          title={`${color.name} ${color.hex}`}
                        >
                          <span className="truncate text-[9px] font-bold text-[#503E2A]">
                            {color.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
