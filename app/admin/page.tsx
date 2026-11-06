"use client";

import { useEffect, useState } from "react";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLogin } from "@/components/admin/admin-login";

const TOKEN_KEY = "moodboard-admin-token";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(window.localStorage.getItem(TOKEN_KEY));
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FEFBF5] text-[#503E2A]">
        <p role="status" className="text-sm font-bold">
          Cargando panel…
        </p>
      </main>
    );
  }

  if (!token) {
    return (
      <AdminLogin
        onLoggedIn={(nextToken) => {
          window.localStorage.setItem(TOKEN_KEY, nextToken);
          setToken(nextToken);
        }}
      />
    );
  }

  return (
    <AdminDashboard
      token={token}
      onLogout={() => {
        window.localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }}
    />
  );
}
