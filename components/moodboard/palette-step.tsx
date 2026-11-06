import type { Palette } from "@/lib/types";

type PaletteStepProps = {
  palettes: Palette[];
  selected: string[];
  onToggle: (id: string) => void;
};

export function PaletteStep({
  palettes,
  selected,
  onToggle,
}: PaletteStepProps) {
  const families: { family: string; palettes: Palette[] }[] = [];

  for (const palette of palettes) {
    const current = families.find((group) => group.family === palette.family);
    if (current) {
      current.palettes.push(palette);
    } else {
      families.push({ family: palette.family, palettes: [palette] });
    }
  }

  return (
    <div className="mt-7 space-y-8">
      <p className="max-w-3xl text-base leading-7 text-[#503E2A] sm:text-lg">
        Elige las paletas que mejor representen la personalidad que imaginas para
        tu marca. Puedes seleccionar todas las que te gusten. Estas paletas son
        una referencia para diseñar las imágenes finales; no es necesario que
        utilicemos exactamente estos colores.
      </p>
      {families.map((group) => (
        <section key={group.family} className="space-y-4">
          <h3 className="font-[Made_Tommy_Soft] text-2xl font-bold text-[#503E2A] sm:text-3xl">
            {group.family}
          </h3>
          <div className="grid gap-4">
            {group.palettes.map((palette) => {
              const isSelected = selected.includes(palette.id);

              return (
                <button
                  key={palette.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggle(palette.id)}
                  className={`relative w-full overflow-hidden rounded-[34px] border-4 bg-white p-3 text-left transition-all sm:p-4 ${
                    isSelected
                      ? "border-[#FD73A4] shadow-[0_12px_30px_rgba(253,115,164,0.22)]"
                      : "border-transparent hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(80,62,42,0.10)]"
                  }`}
                >
                  {isSelected && (
                    <span
                      className="absolute right-5 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#FD73A4] text-xl font-bold text-white"
                      aria-label="Seleccionada"
                    >
                      ✓
                    </span>
                  )}
                  <span className="grid overflow-hidden rounded-[24px] sm:grid-cols-[repeat(5,minmax(120px,1fr))]">
                    {palette.colors.map((color) => (
                      <span
                        key={`${palette.id}-${color.hex}`}
                        className="grid min-h-28 place-content-center px-3 text-center text-[#503E2A] sm:min-h-36"
                        style={{ backgroundColor: color.hex }}
                      >
                        <span className="font-[Made_Tommy_Soft] text-sm font-bold sm:text-base">
                          {color.name}
                        </span>
                        <span className="mt-1 text-xs font-medium uppercase opacity-90">
                          {color.hex}
                        </span>
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
