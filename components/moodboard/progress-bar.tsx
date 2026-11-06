type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <nav
      className="mx-auto w-[calc(100%-2rem)] max-w-[1120px] pt-7"
      aria-label="Progreso de la experiencia"
    >
      <ol
        className="mx-auto mt-7 flex w-full max-w-[760px] gap-4 sm:gap-6"
        aria-label={`Paso ${current + 1} de ${total}`}
      >
        {Array.from({ length: total }, (_, index) => (
          <li
            key={index}
            className={`h-3 flex-1 rounded-full border shadow-[inset_0_1px_2px_rgba(80,62,42,0.08)] sm:h-5 ${
              index <= current
                ? "border-[#A970CE] bg-[#A970CE] shadow-[0_0_12px_rgba(169,112,206,0.18)]"
                : "border-[#E5E3E2] bg-white"
            }`}
            aria-hidden="true"
          />
        ))}
      </ol>
    </nav>
  );
}
