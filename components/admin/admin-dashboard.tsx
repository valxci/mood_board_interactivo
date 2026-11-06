"use client";

import Link from "next/link";
import { useState } from "react";
import { ImagesPanel } from "./images-panel";
import { PalettesPanel } from "./palettes-panel";
import { ProjectsPanel } from "./projects-panel";

type AdminDashboardProps = {
  token: string;
  onLogout: () => void;
};

type Tab = "projects" | "images" | "palettes";

const tabs: { id: Tab; label: string }[] = [
  { id: "projects", label: "Marcas" },
  { id: "images", label: "Imágenes" },
  { id: "palettes", label: "Paletas" },
];

export function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("projects");

  return (
    <div className="min-h-screen bg-[#FEFBF5]">
      <header className="sticky top-0 z-30 border-b border-[#F0DDD9] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A970CE]">
                Administración
              </p>
              <p className="font-[Made_Tommy_Soft] text-2xl font-bold text-[#503E2A]">
                Explora tu marca
              </p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-[#E7D9D2] px-4 py-2 text-xs font-bold text-[#503E2A] transition-colors hover:bg-[#FFF3F7] lg:hidden"
            >
              Salir
            </button>
          </div>

          <nav
            className="flex flex-wrap gap-2"
            aria-label="Secciones del panel"
          >
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={tab === item.id ? "page" : undefined}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                  tab === item.id
                    ? "bg-[#FD73A4] text-white"
                    : "border border-[#E7D9D2] bg-white text-[#503E2A] hover:bg-[#FFF3F7]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/"
              target="_blank"
              className="text-sm font-bold text-[#A970CE] hover:text-[#8A55B0]"
            >
              Ver sitio ↗
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-[#E7D9D2] px-4 py-2 text-sm font-bold text-[#503E2A] transition-colors hover:bg-[#FFF3F7]"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-8">
        {tab === "projects" && (
          <ProjectsPanel token={token} onUnauthorized={onLogout} />
        )}
        {tab === "images" && (
          <ImagesPanel token={token} onUnauthorized={onLogout} />
        )}
        {tab === "palettes" && (
          <PalettesPanel token={token} onUnauthorized={onLogout} />
        )}
      </main>
    </div>
  );
}
