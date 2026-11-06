import Image from "next/image";
import { assetUrl } from "@/lib/api";
import type { Reference } from "@/lib/types";

type MascotStepProps = {
  mascots: Reference[];
  wantsMascot: boolean | null;
  selected: string[];
  onNoMascot: () => void;
  onToggle: (id: string) => void;
};

export function MascotStep({
  mascots,
  wantsMascot,
  selected,
  onNoMascot,
  onToggle,
}: MascotStepProps) {
  return (
    <div className="mt-7">
      <p className="max-w-3xl text-base leading-7 text-[#503E2A] sm:text-lg">
        Una mascota ayuda a dar personalidad y autenticidad a una marca. Puede ser
        un animal, una persona o incluso un objeto animado que represente su
        esencia.
      </p>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[#503E2A] sm:text-lg">
        Selecciona las imágenes que te inspiren o elige «No quiero mascota» si
        prefieres no incluir una en tu marca.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <button
          type="button"
          aria-pressed={wantsMascot === false}
          onClick={onNoMascot}
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
        {mascots.map((mascot, index) => {
          const isSelected = selected.includes(mascot.id);

          return (
            <button
              key={mascot.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(mascot.id)}
              className={`group relative aspect-[4/5] overflow-hidden rounded-[34px] border-4 bg-white text-left transition-all ${
                isSelected
                  ? "border-[#FD73A4] shadow-[0_12px_30px_rgba(253,115,164,0.28)]"
                  : "border-transparent hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(80,62,42,0.12)]"
              }`}
            >
              <Image
                src={assetUrl(mascot.src)}
                alt={mascot.alt || `Referencia de mascota ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              {isSelected && (
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
  );
}
