"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { RoundedButton } from "@/components/rounded-button";
import { login } from "@/lib/api";

type AdminLoginProps = {
  onLoggedIn: (token: string) => void;
};

export function AdminLogin({ onLoggedIn }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password.trim() || loading) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await login(password);
      onLoggedIn(result.token);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No pudimos iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#FEFBF5] px-4 py-8 sm:px-8">
      <section className="w-full max-w-[520px] rounded-[34px] bg-white p-7 shadow-[0_18px_70px_rgba(80,62,42,0.10)] sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A970CE]">
          Administración
        </p>
        <h1 className="mt-3 font-[Made_Tommy_Soft] text-4xl font-bold leading-none text-[#FD73A4] sm:text-5xl">
          Tu panel de marcas
        </h1>
        <p className="mt-4 text-base leading-7 text-[#503E2A]">
          Entra para revisar las respuestas, analizar cada marca y administrar las
          imágenes y paletas de la experiencia.
        </p>

        <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
          <label className="block" htmlFor="admin-password">
            <span className="text-sm font-bold text-[#503E2A]">Contraseña</span>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Escribe la contraseña del panel"
              autoComplete="current-password"
              className="input mt-2 h-14 w-full rounded-[22px] border-[#E7D9D2] bg-[#FEFBF7] px-5 text-base text-[#503E2A] placeholder:text-[#503E2A]/45 focus:border-[#FD73A4] focus:outline-none"
              required
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-[18px] border border-[#F3C6D6] bg-[#FFF3F7] px-4 py-3 text-sm font-medium text-[#503E2A]"
            >
              {error}
            </p>
          )}

          <RoundedButton
            type="submit"
            disabled={loading || password.trim().length === 0}
            className="min-h-14 w-full rounded-full text-lg font-bold"
          >
            {loading ? "Entrando…" : "Entrar al panel"}
          </RoundedButton>
        </form>

        <Link
          href="/"
          className="mt-6 inline-block text-sm font-bold text-[#A970CE] hover:text-[#8A55B0]"
        >
          ← Volver al moodboard
        </Link>
      </section>
    </main>
  );
}
