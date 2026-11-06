"use client";

import { useState } from "react";
import { RoundedButton } from "@/components/rounded-button";

type IntroFormProps = {
  onContinue: (data: { brandName: string; personName: string }) => void;
  contentReady: boolean;
  contentLoading: boolean;
  contentError: string | null;
  onRetryContent: () => void;
};

export function IntroForm({
  onContinue,
  contentReady,
  contentLoading,
  contentError,
  onRetryContent,
}: IntroFormProps) {
  const [brandName, setBrandName] = useState("");
  const [personName, setPersonName] = useState("");

  const canContinue =
    brandName.trim().length > 0 &&
    personName.trim().length > 0 &&
    contentReady &&
    !contentLoading &&
    !contentError;

  return (
    <main className="grid min-h-screen place-items-center bg-[#FEFBF5] px-4 py-8 sm:px-8">
      <section className="w-full max-w-[820px] rounded-[34px] bg-white p-6 shadow-[0_18px_70px_rgba(80,62,42,0.10)] sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#503E2A]">
          Antes de empezar
        </p>
        <h1 className="mt-4 font-[Made_Tommy_Soft] text-4xl font-bold leading-none text-[#FD73A4] sm:text-6xl">
          Cuéntanos de ti
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#503E2A] sm:text-lg">
          Queremos guardar tus respuestas junto al nombre de tu marca. Así, cuando
          termine esta exploración, todo quedará organizado en un mismo lugar.
        </p>

        <form
          className="mt-8 grid gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!canContinue) {
              return;
            }
            onContinue({
              brandName: brandName.trim(),
              personName: personName.trim(),
            });
          }}
        >
          <label className="block" htmlFor="brand-name">
            <span className="text-lg font-bold text-[#503E2A]">
              ¿Cómo se llama tu marca?
            </span>
            <input
              id="brand-name"
              type="text"
              value={brandName}
              onChange={(event) => setBrandName(event.target.value)}
              placeholder="Escribe el nombre de tu marca"
              maxLength={120}
              autoComplete="organization"
              className="input mt-3 h-14 w-full rounded-[22px] border-[#E7D9D2] bg-[#FEFBF7] px-5 text-base text-[#503E2A] placeholder:text-[#503E2A]/45 focus:border-[#FD73A4] focus:outline-none"
              required
            />
          </label>

          <label className="block" htmlFor="person-name">
            <span className="text-lg font-bold text-[#503E2A]">
              ¿Cómo te llamas?
            </span>
            <input
              id="person-name"
              type="text"
              value={personName}
              onChange={(event) => setPersonName(event.target.value)}
              placeholder="Escribe tu nombre"
              maxLength={120}
              autoComplete="name"
              className="input mt-3 h-14 w-full rounded-[22px] border-[#E7D9D2] bg-[#FEFBF7] px-5 text-base text-[#503E2A] placeholder:text-[#503E2A]/45 focus:border-[#FD73A4] focus:outline-none"
              required
            />
          </label>

          {contentError && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-[22px] border border-[#F3C6D6] bg-[#FFF3F7] p-5 text-sm text-[#503E2A] sm:flex-row sm:items-center sm:justify-between"
            >
              <span>
                No pudimos cargar las referencias y paletas. Revisa que el API esté
                funcionando.
              </span>
              <button
                type="button"
                onClick={onRetryContent}
                className="rounded-full bg-[#FD73A4] px-5 py-2 font-bold text-white transition-colors hover:bg-[#EC6294]"
              >
                Reintentar
              </button>
            </div>
          )}

          {contentLoading && !contentError && (
            <p className="text-sm font-medium text-[#503E2A]/70" role="status">
              Cargando referencias y paletas…
            </p>
          )}

          <RoundedButton
            type="submit"
            disabled={!canContinue}
            className="min-h-14 w-full rounded-full px-12 text-lg font-bold sm:w-[280px]"
          >
            Comenzar
          </RoundedButton>
        </form>
      </section>
    </main>
  );
}
