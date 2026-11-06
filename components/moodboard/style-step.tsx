import Image from "next/image";
import { assetUrl } from "@/lib/api";
import type { Reference } from "@/lib/types";

type StyleStepProps = {
  references: Reference[];
  selected: string[];
  onToggle: (id: string) => void;
};

export function StyleStep({ references, selected, onToggle }: StyleStepProps) {
  return (
    <>
      <p className="mt-5 max-w-3xl leading-7 text-[#503E2A] sm:text-lg">
        Estas imágenes muestran diferentes formas de comunicar una marca.
        Selecciona todas las que te hagan decir: “me gustaría que mi marca se
        sintiera así”. Para estas referencias, no te fijes en el empaque: observa
        principalmente el logo y lo que transmite.
      </p>
      <p className="mt-3 text-sm font-bold text-[#503E2A]">
        Puedes seleccionar varias imágenes.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {references.map((reference, index) => {
          const isSelected = selected.includes(reference.id);

          return (
            <button
              key={reference.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(reference.id)}
              className={`group relative aspect-[4/5] overflow-hidden rounded-[34px] border-4 bg-white text-left transition-all ${
                isSelected
                  ? "border-[#FD73A4] shadow-[0_12px_30px_rgba(253,115,164,0.28)]"
                  : "border-transparent hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(80,62,42,0.12)]"
              }`}
            >
              <Image
                src={assetUrl(reference.src)}
                alt={reference.alt || `Referencia visual ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
    </>
  );
}
