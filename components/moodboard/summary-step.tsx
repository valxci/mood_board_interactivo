import Image from "next/image";
import { assetUrl } from "@/lib/api";
import type {
  Palette,
  Reference,
  SubmissionAnswer,
} from "@/lib/types";

type SummaryStepProps = {
  brandName: string;
  personName: string;
  references: Reference[];
  palettes: Palette[];
  wantsMascot: boolean | null;
  mascotReferences: Reference[];
  answers: SubmissionAnswer[];
};

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#A970CE]">
        {eyebrow}
      </p>
      <h2 className="mt-1 font-[Made_Tommy_Soft] text-2xl font-bold text-[#503E2A] sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

export function SummaryStep({
  brandName,
  personName,
  references,
  palettes,
  wantsMascot,
  mascotReferences,
  answers,
}: SummaryStepProps) {
  const today = new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="mt-8 overflow-hidden rounded-[34px] border border-[#F0DDD9] bg-[#FEFBF7]">
      <header className="relative overflow-hidden bg-[#FFF3F7] px-6 py-8 sm:px-10 sm:py-10">
        <div
          className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-[#F9AFC9]/40 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-[#C9B6F2]/35 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A970CE]">
            Moodboard · {today}
          </p>
          <h2 className="mt-2 font-[Made_Tommy_Soft] text-4xl font-bold leading-tight text-[#FD73A4] sm:text-5xl">
            {brandName}
          </h2>
          <p className="mt-2 text-sm font-medium text-[#503E2A]/80">
            Exploración de identidad creada por {personName}
          </p>
        </div>
      </header>

      <div className="space-y-10 px-6 py-8 sm:px-10 sm:py-10">
        <section>
          <SectionTitle
            eyebrow="Paso 1"
            title={`Estilo visual · ${references.length} ${
              references.length === 1 ? "referencia" : "referencias"
            }`}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {references.map((reference, index) => (
              <div
                key={reference.id}
                className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-[#F0DDD9] bg-white"
              >
                <Image
                  src={assetUrl(reference.src)}
                  alt={reference.alt || `Referencia visual ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle
            eyebrow="Paso 2"
            title={`Paletas de color · ${palettes.length} ${
              palettes.length === 1 ? "paleta" : "paletas"
            }`}
          />
          <div className="grid gap-4">
            {palettes.map((palette) => (
              <div
                key={palette.id}
                className="rounded-[24px] border border-[#F0DDD9] bg-white p-3 sm:p-4"
              >
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 px-1">
                  <span className="text-sm font-bold text-[#503E2A]">
                    {palette.family}
                  </span>
                  <span className="text-xs font-medium text-[#503E2A]/60">
                    {palette.name}
                  </span>
                </div>
                <div className="grid overflow-hidden rounded-[18px] sm:grid-cols-[repeat(5,minmax(80px,1fr))]">
                  {palette.colors.map((color) => (
                    <div
                      key={`${palette.id}-${color.hex}`}
                      className="grid min-h-20 place-content-center px-2 py-3 text-center text-[#503E2A]"
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className="text-xs font-bold sm:text-sm">
                        {color.name}
                      </span>
                      <span className="mt-0.5 text-[10px] font-medium uppercase opacity-90">
                        {color.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle eyebrow="Paso 3" title="Mascota" />
          {wantsMascot === false ? (
            <p className="inline-flex rounded-full bg-[#F3EAF9] px-5 py-3 text-sm font-bold text-[#7B5A93]">
              Sin mascota por ahora
            </p>
          ) : mascotReferences.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {mascotReferences.map((reference, index) => (
                <div
                  key={reference.id}
                  className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-[#F0DDD9] bg-white"
                >
                  <Image
                    src={assetUrl(reference.src)}
                    alt={reference.alt || `Referencia de mascota ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#503E2A]/70">
              Todavía no hay referencias de mascota.
            </p>
          )}
        </section>

        {answers.length > 0 && (
          <section>
            <SectionTitle eyebrow="Paso 4" title="Lo que nos contaste" />
            <div className="grid gap-4">
              {answers.map((answer, index) => (
                <div
                  key={answer.id}
                  className="rounded-[24px] border border-[#F0DDD9] bg-white p-5"
                >
                  <p className="flex gap-2 text-sm font-bold text-[#503E2A] sm:text-base">
                    <span className="text-[#FD73A4]">{index + 1}.</span>
                    <span>{answer.question}</span>
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#503E2A]/80 sm:text-base sm:leading-7">
                    {answer.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
