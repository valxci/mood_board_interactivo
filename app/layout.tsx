import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Explora tu marca",
  description: "Primera fase de exploracion de identidad visual",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
