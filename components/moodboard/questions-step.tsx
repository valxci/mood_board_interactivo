import type { BrandQuestion } from "@/content/brand-questions";

type QuestionsStepProps = {
  questions: BrandQuestion[];
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
};

export function QuestionsStep({
  questions,
  answers,
  onChange,
}: QuestionsStepProps) {
  return (
    <div className="mt-7">
      <p className="max-w-3xl text-base leading-7 text-[#503E2A] sm:text-lg">
        Ya casi terminamos. Antes de cerrar esta exploración, queremos conocer
        algunos detalles adicionales que nos ayudarán a entender mejor lo que
        imaginas para tu marca.
      </p>
      <div className="mt-7 grid gap-5">
        {questions.map((item, index) => (
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
              value={answers[item.id] ?? ""}
              onChange={(event) => onChange(item.id, event.target.value)}
              placeholder={item.placeholder}
              className="textarea mt-5 min-h-28 w-full rounded-[22px] border-[#E7D9D2] bg-white px-5 py-4 text-base text-[#503E2A] placeholder:text-[#503E2A]/45 focus:border-[#FD73A4] focus:outline-none"
            />
          </section>
        ))}
      </div>
    </div>
  );
}
