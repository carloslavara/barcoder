import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barcode Character Generator",
  description: "Scan barcode digits to create a deterministic, safe anime-inspired character prompt.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
