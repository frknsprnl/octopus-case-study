import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Octopus Case Study",
  description: "Mini e‑commerce case study"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}

