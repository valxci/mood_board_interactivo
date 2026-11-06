import Image from "next/image";
import { RoundedButton } from "@/components/rounded-button";

type WelcomeScreenProps = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
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
              onClick={onStart}
            >
              Empecemos
            </RoundedButton>
          </div>
          <div className="relative min-h-[380px] sm:min-h-full">
            {/* Si cambias la imagen, usa otro nombre de archivo para evitar la caché. */}
            <Image
              src="/graphics/welcome-illustration-v2.png"
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
