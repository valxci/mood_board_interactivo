"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ApiError,
  assetUrl,
  deleteReference,
  getAdminReferences,
  uploadReference,
} from "@/lib/api";
import type { Reference } from "@/lib/types";

type ImagesPanelProps = {
  token: string;
  onUnauthorized: () => void;
};

function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function ImagesPanel({ token, onUnauthorized }: ImagesPanelProps) {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [kind, setKind] = useState<"style" | "mascot">("style");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminReferences(token);
      setReferences(data);
    } catch (loadError) {
      if (isUnauthorized(loadError)) {
        onUnauthorized();
        return;
      }
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No pudimos cargar las imágenes.",
      );
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const grouped = useMemo(
    () => ({
      style: references.filter((reference) => reference.kind === "style"),
      mascot: references.filter((reference) => reference.kind === "mascot"),
    }),
    [references],
  );

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (uploading) {
      return;
    }
    if (!file) {
      setFormError("Elige una imagen para subir.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", alt.trim() || file.name);
    formData.append("kind", kind);
    if (kind === "style" && category.trim()) {
      formData.append("category", category.trim());
    }

    setUploading(true);
    setFormError(null);
    setSuccess(null);

    try {
      const created = await uploadReference(token, formData);
      setReferences((current) => [...current, created]);
      setFile(null);
      setAlt("");
      setCategory("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSuccess("Imagen agregada a la experiencia.");
    } catch (uploadError) {
      if (isUnauthorized(uploadError)) {
        onUnauthorized();
        return;
      }
      setFormError(
        uploadError instanceof Error
          ? uploadError.message
          : "No pudimos subir la imagen.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (reference: Reference) => {
    if (deletingId) {
      return;
    }
    if (
      !window.confirm(
        `¿Eliminar «${reference.alt}»? Dejará de aparecer en la experiencia.`,
      )
    ) {
      return;
    }

    setDeletingId(reference.id);
    setFormError(null);
    try {
      await deleteReference(token, reference.id);
      setReferences((current) =>
        current.filter((item) => item.id !== reference.id),
      );
    } catch (deleteError) {
      if (isUnauthorized(deleteError)) {
        onUnauthorized();
        return;
      }
      setFormError(
        deleteError instanceof Error
          ? deleteError.message
          : "No pudimos eliminar la imagen.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A970CE]">
          Biblioteca visual
        </p>
        <h2 className="mt-1 font-[Made_Tommy_Soft] text-3xl font-bold text-[#503E2A] sm:text-4xl">
          Imágenes de la experiencia
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#503E2A]/70">
          Sube referencias nuevas sin tocar el código. Las de estilo aparecen en
          el paso 1 y las de mascota en el paso 3.
        </p>
      </div>

      <form
        onSubmit={handleUpload}
        className="rounded-[28px] border border-[#F0DDD9] bg-white p-6 sm:p-8"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-[#503E2A]">Imagen</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="mt-2 block w-full cursor-pointer rounded-[18px] border border-[#E7D9D2] bg-[#FEFBF7] px-4 py-3 text-sm text-[#503E2A] file:mr-4 file:rounded-full file:border-0 file:bg-[#F9AFC9] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[#503E2A]"
            />
            <span className="mt-1 block text-xs text-[#503E2A]/55">
              PNG, JPG o WebP · máximo 8 MB
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#503E2A]">
              Descripción (alt)
            </span>
            <input
              type="text"
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              placeholder="Ej. Logo orgánico con trazos hechos a mano"
              maxLength={300}
              className="input mt-2 h-12 w-full rounded-[18px] border-[#E7D9D2] bg-[#FEFBF7] px-4 text-sm text-[#503E2A] placeholder:text-[#503E2A]/45 focus:border-[#FD73A4] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#503E2A]">Tipo</span>
            <select
              value={kind}
              onChange={(event) =>
                setKind(event.target.value as "style" | "mascot")
              }
              className="select mt-2 h-12 w-full rounded-[18px] border-[#E7D9D2] bg-[#FEFBF7] px-4 text-sm text-[#503E2A] focus:border-[#FD73A4] focus:outline-none"
            >
              <option value="style">Referencia de estilo (paso 1)</option>
              <option value="mascot">Referencia de mascota (paso 3)</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#503E2A]">
              Categoría de estilo
            </span>
            <input
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Ej. Minimalista, orgánico, editorial…"
              maxLength={120}
              disabled={kind !== "style"}
              className="input mt-2 h-12 w-full rounded-[18px] border-[#E7D9D2] bg-[#FEFBF7] px-4 text-sm text-[#503E2A] placeholder:text-[#503E2A]/45 focus:border-[#FD73A4] focus:outline-none disabled:opacity-50"
            />
            <span className="mt-1 block text-xs text-[#503E2A]/55">
              Se usa para el análisis de estilo. Opcional.
            </span>
          </label>
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
          disabled={uploading}
          className="mt-5 rounded-full bg-[#FD73A4] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#EC6294] disabled:opacity-50"
        >
          {uploading ? "Subiendo…" : "Subir imagen"}
        </button>
      </form>

      {loading ? (
        <p role="status" className="text-sm font-bold text-[#503E2A]/70">
          Cargando imágenes…
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
        <div className="space-y-8">
          {(
            [
              { key: "style", label: "Referencias de estilo", items: grouped.style },
              {
                key: "mascot",
                label: "Referencias de mascota",
                items: grouped.mascot,
              },
            ] as const
          ).map((group) => (
            <div key={group.key}>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#503E2A]">
                {group.label}
                <span className="rounded-full bg-[#FFF3F7] px-3 py-1 text-xs">
                  {group.items.length}
                </span>
              </h3>
              {group.items.length === 0 ? (
                <p className="rounded-[20px] border border-dashed border-[#E7D9D2] bg-white p-6 text-sm text-[#503E2A]/60">
                  Todavía no hay imágenes en esta sección.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {group.items.map((reference) => (
                    <article
                      key={reference.id}
                      className="group relative overflow-hidden rounded-[18px] border border-[#F0DDD9] bg-white"
                    >
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={assetUrl(reference.src)}
                          alt={reference.alt}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 180px"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="truncate text-[11px] font-bold text-[#503E2A]">
                          {reference.alt}
                        </p>
                        {reference.category && (
                          <p className="mt-0.5 truncate text-[10px] font-medium text-[#A970CE]">
                            {reference.category}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleDelete(reference)}
                        disabled={deletingId === reference.id}
                        aria-label={`Eliminar ${reference.alt}`}
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-sm font-bold text-[#D9416F] shadow-sm transition-colors hover:bg-[#FFF3F7] disabled:opacity-50"
                      >
                        ×
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
