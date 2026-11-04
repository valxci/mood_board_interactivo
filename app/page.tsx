"use client";

import Image from "next/image";
import { useState } from "react";
import { RoundedButton } from "@/components/rounded-button";

type BrandQuestion = {
  id: string;
  question: string;
  description?: string;
  placeholder: string;
};

const brandQuestions: BrandQuestion[] = [
  {
    id: "mustHave",
    question: "¿Hay algo que definitivamente quieras que tenga tu marca?",
    description: "Puede ser un símbolo, un elemento gráfico, un concepto, un objeto o alguna idea que tengas en mente.",
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
    question: "¿Qué te gustaría que las personas sintieran o pensaran al ver tu marca?",
    description: "Por ejemplo: confianza, alegría, cercanía, elegancia, creatividad, tranquilidad...",
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
    description: "¡Este espacio es completamente tuyo! Cuéntanos cualquier idea, expectativa o detalle que consideres importante para construir tu marca.",
    placeholder: "Aquí puedes contarnos cualquier detalle adicional...",
  },
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const completedSegments = step + 1;
  const [selectedReferences, setSelectedReferences] = useState<string[]>([]);
  const [brandAnswers, setBrandAnswers] = useState<Record<string, string>>({});
  const [selectedPalettes, setSelectedPalettes] = useState<string[]>([]);
  const [wantsMascot, setWantsMascot] = useState<boolean | null>(null);
  const [selectedMascotReferences, setSelectedMascotReferences] = useState<string[]>([]);
  const references = [
    "image 5.png", "image 6.png",
    "image 7.png", "image 8.png", "image 9.png", "image 10.png",
    "image 11.png", "image 12.png", "image 13.png", "image 14.png",
    "image 15.png",
    "reference-17.png", "reference-18.png", "reference-19.png",
    "reference-20.png", "reference-21.png", "reference-22.png",
    "reference-23.png", "reference-24.png", "reference-25.png", "reference-26.png",
    "reference-27.png", "reference-28.png", "reference-29.png", "reference-30.png",
    "reference-31.png", "reference-32.png", "reference-33.png",
  ];

  const toggleReference = (reference: string) => {
    setSelectedReferences((current) =>
      current.includes(reference)
        ? current.filter((item) => item !== reference)
        : [...current, reference],
    );
  };

  const steps = [
    { name: "Estilos visuales", title: "¿Qué estilo visual te gusta?", eyebrow: "PASO 1" },
    { name: "Colores", title: "¿Qué colores imaginas para tu marca?", eyebrow: "PASO 2" },
    { name: "Mascota", title: "¿Tu marca tendrá una mascota?", eyebrow: "PASO 3" },
    { name: "Tu marca", title: "Cuéntanos un poquito más", eyebrow: "PASO 4" },
    { name: "Resumen", title: "Así se empieza a ver tu marca", eyebrow: "RESUMEN" },
  ];

  const colorPalettes = [
    {
      id: "colorful-vibrant",
      name: "Coloridas y vibrantes",
      palettes: [
        [
          { name: "Lime cream", hex: "#D9FB5F" },
          { name: "Hot pink", hex: "#FF66A9" },
          { name: "Princeton orange", hex: "#FE8616" },
          { name: "Majorelle blue", hex: "#7B46F8" },
          { name: "Aqua pop", hex: "#20C9C3" },
        ],
        [
          { name: "Bubblegum", hex: "#FF477E" },
          { name: "Tangerine", hex: "#FF9F1C" },
          { name: "Lemon pop", hex: "#FFD93D" },
          { name: "Grape candy", hex: "#A66CFF" },
          { name: "Mint splash", hex: "#45D6B5" },
        ],
      ],
    },
    {
      id: "tropical-paradise",
      name: "Tropicales y frutales",
      palettes: [
        [
          { name: "Jungle green", hex: "#087F5B" },
          { name: "Pineapple green", hex: "#B7C94B" },
          { name: "Sunshine", hex: "#FFC928" },
          { name: "Mango orange", hex: "#FF793F" },
          { name: "Guava pink", hex: "#F0447D" },
        ],
        [
          { name: "Summer yellow", hex: "#F9AF08" },
          { name: "Mango orange", hex: "#F06707" },
          { name: "Dragon fruit", hex: "#FD777A" },
          { name: "Berry pink", hex: "#E11C8A" },
          { name: "Kiwi green", hex: "#9BCA3B" },
        ],
      ],
    },
    {
      id: "strawberry-milk",
      name: "Dulces y cute",
      palettes: [
        [
          { name: "Strawberry milk", hex: "#F7A8C4" },
          { name: "Pink frosting", hex: "#FF6F91" },
          { name: "Lavender", hex: "#D8B4F8" },
          { name: "Vanilla cream", hex: "#FFF0B3" },
          { name: "Mint candy", hex: "#A8DCCB" },
        ],
        [
          { name: "Cotton pink", hex: "#FFB6D5" },
          { name: "Sugar violet", hex: "#B9A0F5" },
          { name: "Blue raspberry", hex: "#91D9E8" },
          { name: "Peach sugar", hex: "#FFE08A" },
          { name: "Creamy peach", hex: "#F5C9B8" },
        ],
      ],
    },
    {
      id: "ice-pop",
      name: "Refrescantes y acuáticas",
      palettes: [
        [
          { name: "Ice blue", hex: "#45C6D9" },
          { name: "Aqua mint", hex: "#8DE3DC" },
          { name: "Lime ice", hex: "#B5E85B" },
          { name: "Blue raspberry", hex: "#65A8ED" },
          { name: "Snow cream", hex: "#F4F4E8" },
        ],
        [
          { name: "Ocean blue", hex: "#087EBA" },
          { name: "Turquoise", hex: "#00BFA6" },
          { name: "Glacier", hex: "#76D7EA" },
          { name: "Lemon lime", hex: "#D3F36B" },
          { name: "Pineapple", hex: "#FFCA65" },
        ],
      ],
    },
    {
      id: "citrus-party",
      name: "Cítricas y energéticas",
      palettes: [
        [
          { name: "Lemon zest", hex: "#D5E928" },
          { name: "Lime green", hex: "#A6C936" },
          { name: "Sun yellow", hex: "#FFCA28" },
          { name: "Orange zest", hex: "#FF8C24" },
          { name: "Blood orange", hex: "#F45B35" },
        ],
        [
          { name: "Mango sun", hex: "#FFB02E" },
          { name: "Papaya", hex: "#FF7A45" },
          { name: "Watermelon", hex: "#F45168" },
          { name: "Berry juice", hex: "#D93682" },
          { name: "Purple grape", hex: "#9B4DCA" },
        ],
      ],
    },
    {
      id: "creamy-treats",
      name: "Cremosas y apetitosas",
      palettes: [
        [
          { name: "Vanilla", hex: "#FFF0CF" },
          { name: "Peach cream", hex: "#F5C18A" },
          { name: "Caramel", hex: "#D99A70" },
          { name: "Strawberry", hex: "#E9A8BE" },
          { name: "Pistachio", hex: "#B7C99A" },
        ],
        [
          { name: "Peach pink", hex: "#F6A6A1" },
          { name: "Mango cream", hex: "#F8C96D" },
          { name: "Matcha", hex: "#B5CFA5" },
          { name: "Ube purple", hex: "#C7A5DD" },
          { name: "Oat milk", hex: "#F3E2CB" },
        ],
      ],
    },
    {
      id: "retro-summer",
      name: "Retro y divertidas",
      palettes: [
        [
          { name: "Coral red", hex: "#F05A47" },
          { name: "Mustard", hex: "#F4B942" },
          { name: "Retro mint", hex: "#79B7A0" },
          { name: "Denim blue", hex: "#5877B7" },
          { name: "Vanilla beige", hex: "#F2D8B3" },
        ],
        [
          { name: "Retro pink", hex: "#EA5D8F" },
          { name: "Orange soda", hex: "#F28E2B" },
          { name: "Lemon soda", hex: "#E8CE48" },
          { name: "Vintage green", hex: "#628C78" },
          { name: "Grape soda", hex: "#8E75B8" },
        ],
      ],
    },
  ];

  if (!started) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FEFBF5] px-4 py-5 sm:px-8 sm:py-8">
        <section className="relative w-full max-w-[1120px] overflow-hidden rounded-[34px] bg-white shadow-[0_18px_70px_rgba(80,62,42,0.10)] sm:min-h-[600px]">
          <div className="grid items-center sm:min-h-[600px] sm:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 px-7 py-10 sm:px-12 sm:py-14 lg:px-[4.5rem]">
              <h1 className="max-w-[520px] font-[Made_Tommy_Soft] text-[42px] font-bold leading-[1.02] text-[#F66FA5] sm:text-[58px] lg:text-[68px]">
                Bienvenido a la primera etapa de tu marca.
              </h1>
              <p className="mt-8 max-w-[620px] text-lg leading-8 text-[#503E2A] lg:text-[22px]">
                Antes de empezar a diseñar, queremos descubrir qué personalidad,
                estilo y esencia queremos transmitir visualmente.
              </p>
              <RoundedButton
                className="mt-8 min-h-14 w-full rounded-full bg-[#F66FA5] px-12 text-lg font-bold text-white sm:w-[280px]"
                onClick={() => setStarted(true)}
              >
                Empecemos
              </RoundedButton>
            </div>
            <div className="relative min-h-[380px] sm:min-h-full">
              <Image
                src="/graphics/welcome-illustration.png"
                alt="Ilustración de una diseñadora con un lápiz"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 45vw"
                className="object-contain object-center sm:scale-110"
              />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFBF5]">
      <nav className="mx-auto w-[calc(100%-2rem)] max-w-[1120px] pt-7" aria-label="Progreso de la experiencia">
        <ol className="mx-auto mt-7 flex w-full max-w-[760px] gap-4 sm:gap-6" aria-label={`Paso ${step + 1} de ${steps.length}`}>
          {Array.from({ length: steps.length }, (_, index) => (
            <li
              key={index}
              className={`h-3 flex-1 rounded-full border shadow-[inset_0_1px_2px_rgba(80,62,42,0.08)] sm:h-5 ${index < completedSegments
                  ? "border-[#A970CE] bg-[#A970CE] shadow-[0_0_12px_rgba(169,112,206,0.18)]"
                  : "border-[#E5E3E2] bg-white"
                }`}
              aria-hidden="true"
            />
          ))}
        </ol>
      </nav>

      <main className="card mx-auto my-8 w-[calc(100%-2rem)] max-w-[1120px] overflow-hidden rounded-[34px] bg-white shadow-[0_18px_60px_rgba(80,62,42,0.08)] sm:my-14">
        <div className="card-body p-5 sm:p-12">
          <p className="mb-4 text-xs font-bold tracking-[0.12em] text-[#503E2A] uppercase">{steps[step].eyebrow}</p>
          <h1 className="font-[Made_Tommy_Soft] text-4xl font-bold leading-none text-[#FD73A4] sm:text-6xl">
            {steps[step].title}
          </h1>
          {step === 0 && (
            <>
              <p className="mt-5 max-w-3xl leading-7 text-[#503E2A] sm:text-lg">
                Estas imágenes muestran diferentes formas de comunicar una marca.
                Selecciona todas las que te hagan decir: “me gustaría que mi marca se sintiera así”.
                Para estas referencias, no te fijes en el empaque: observa principalmente el logo y lo que transmite.
              </p>
              <p className="mt-3 text-sm font-bold text-[#503E2A]">
                Puedes seleccionar varias imágenes.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {references.map((reference, index) => {
                  const selected = selectedReferences.includes(reference);

                  return (
                    <button
                      key={reference}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleReference(reference)}
                      className={`group relative aspect-[4/5] overflow-hidden rounded-[34px] border-4 bg-white text-left transition-all ${selected
                          ? "border-[#FD73A4] shadow-[0_12px_30px_rgba(253,115,164,0.28)]"
                          : "border-transparent hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(80,62,42,0.12)]"
                        }`}
                    >
                      <Image
                        src={`/references/${reference}`}
                        alt={`Referencia visual ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      {selected && (
                        <span
                          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-[#FD73A4] text-xl font-bold text-white shadow-lg"
                          aria-label="Seleccionada"
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {step === 1 && (
            <div className="mt-7 space-y-8">
              <p className="max-w-3xl text-base leading-7 text-[#503E2A] sm:text-lg">
                Elige las paletas que mejor representen la personalidad que imaginas para tu marca.
                Puedes seleccionar todas las que te gusten.
                Estas paletas son una referencia para diseñar las imágenes finales; no es necesario que utilicemos exactamente estos colores.
              </p>
              {colorPalettes.map((palette) => {
                return (
                  <section
                    key={palette.id}
                    className="space-y-4"
                  >
                    <h3 className="font-[Made_Tommy_Soft] text-2xl font-bold text-[#503E2A] sm:text-3xl">
                      {palette.name}
                    </h3>
                    <div className="grid gap-4">
                      {palette.palettes.map((colors, paletteIndex) => {
                        const paletteId = `${palette.id}-${paletteIndex}`;
                        const selected = selectedPalettes.includes(paletteId);

                        return (
                          <button
                            key={paletteId}
                            type="button"
                            aria-pressed={selected}
                            onClick={() =>
                              setSelectedPalettes((current) =>
                                current.includes(paletteId)
                                  ? current.filter((id) => id !== paletteId)
                                  : [...current, paletteId],
                              )
                            }
                            className={`relative w-full overflow-hidden rounded-[34px] border-4 bg-white p-3 text-left transition-all sm:p-4 ${
                              selected
                                ? "border-[#FD73A4] shadow-[0_12px_30px_rgba(253,115,164,0.22)]"
                                : "border-transparent hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(80,62,42,0.10)]"
                            }`}
                          >
                            {selected && (
                              <span className="absolute right-5 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#FD73A4] text-xl font-bold text-white" aria-label="Seleccionada">
                                ✓
                              </span>
                            )}
                            <span className="grid overflow-hidden rounded-[24px] sm:grid-cols-[repeat(5,minmax(120px,1fr))]">
                              {colors.map((color) => (
                                <span
                                  key={color.hex}
                                  className="min-h-28 grid place-content-center px-3 text-center text-[#503E2A] sm:min-h-36"
                                  style={{ backgroundColor: color.hex }}
                                >
                                  <span className="font-[Made_Tommy_Soft] text-sm font-bold sm:text-base">{color.name}</span>
                                  <span className="mt-1 text-xs font-medium uppercase opacity-90">{color.hex}</span>
                                </span>
                              ))}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
          {step === 3 && (
            <div className="mt-7">
              <p className="max-w-3xl text-base leading-7 text-[#503E2A] sm:text-lg">
                Ya casi terminamos. Antes de cerrar esta exploración, queremos conocer algunos detalles adicionales
                que nos ayudarán a entender mejor lo que imaginas para tu marca.
              </p>
              <div className="mt-7 grid gap-5">
                {brandQuestions.map((item, index) => (
                  <section
                    key={item.id}
                    className="rounded-[34px] border border-[#F0DDD9] bg-[#FEFBF7] p-5 sm:p-7"
                  >
                    <label htmlFor={item.id} className="block">
                      <span className="flex gap-3 text-lg font-bold text-[#503E2A] sm:text-xl">
                        <span className="text-[#FD73A4]">{index + 1}.</span>
                        <span>{item.question}</span>
                      </span>
                      {item.description && (
                        <span className="mt-3 block text-base leading-7 text-[#503E2A]">
                          {item.description}
                        </span>
                      )}
                    </label>
                    <textarea
                      id={item.id}
                      rows={3}
                      value={brandAnswers[item.id] ?? ""}
                      onChange={(event) =>
                        setBrandAnswers((current) => ({
                          ...current,
                          [item.id]: event.target.value,
                        }))
                      }
                      placeholder={item.placeholder}
                      className="textarea mt-5 min-h-28 w-full rounded-[22px] border-[#E7D9D2] bg-white px-5 py-4 text-base text-[#503E2A] placeholder:text-[#503E2A]/45 focus:border-[#FD73A4] focus:outline-none"
                    />
                  </section>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="mt-7">
              <p className="max-w-3xl text-base leading-7 text-[#503E2A] sm:text-lg">
                Una mascota ayuda a dar personalidad y autenticidad a una marca. Puede ser un animal, una persona
                o incluso un objeto animado que represente su esencia.
              </p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#503E2A] sm:text-lg">
                Selecciona las imágenes que te inspiren o elige «No quiero mascota» si prefieres no incluir una en tu marca.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <button
                  type="button"
                  aria-pressed={wantsMascot === false}
                  onClick={() => {
                    setWantsMascot(false);
                    setSelectedMascotReferences([]);
                  }}
                  className={`relative grid aspect-[4/5] place-items-center rounded-[34px] border-4 px-5 text-center font-[Made_Tommy_Soft] text-xl font-bold text-[#B58ACB] transition-all sm:text-2xl ${
                    wantsMascot === false
                      ? "border-[#FD73A4] bg-[#F3EAF9] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(80,62,42,0.10)]"
                      : "border-transparent bg-[#F3EAF9] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(80,62,42,0.10)]"
                  }`}
                >
                  No quiero mascota
                  {wantsMascot === false && (
                    <span
                      className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-[#FD73A4] text-xl font-bold text-white shadow-lg"
                      aria-label="Seleccionada"
                    >
                      ✓
                    </span>
                  )}
                </button>
                {Array.from({ length: 10 }, (_, index) => {
                      const filename = `mascot-${index + 1}.png`;
                      const selected = selectedMascotReferences.includes(filename);

                      return (
                        <button
                          key={filename}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            setWantsMascot(true);
                            setSelectedMascotReferences((current) =>
                              current.includes(filename)
                                ? current.filter((item) => item !== filename)
                                : [...current, filename],
                            )
                          }}
                          className={`group relative aspect-[4/5] overflow-hidden rounded-[34px] border-4 bg-white text-left transition-all ${
                            selected
                              ? "border-[#FD73A4] shadow-[0_12px_30px_rgba(253,115,164,0.28)]"
                              : "border-transparent hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(80,62,42,0.12)]"
                          }`}
                        >
                          <Image
                            src={`/mascot-references/${filename}`}
                            alt={`Referencia de mascota ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                          {selected && (
                            <span
                              className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-[#FD73A4] text-xl font-bold text-white shadow-lg"
                              aria-label="Seleccionada"
                            >
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
              </div>
            </div>
          )}
          <div className="mt-7 flex justify-between gap-3">
            <RoundedButton
              variant="soft"
              className="w-[46%] sm:w-auto"
              disabled={step === 0}
              onClick={() => setStep((current) => current - 1)}
            >
              ← Anterior
            </RoundedButton>
            <RoundedButton
              className="w-[46%] sm:w-auto"
              disabled={step === steps.length - 1}
              onClick={() => setStep((current) => current + 1)}
            >
              Siguiente <span aria-hidden="true">→</span>
            </RoundedButton>
          </div>
        </div>
      </main>
    </div>
  );
}
