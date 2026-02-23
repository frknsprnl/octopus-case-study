import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Uygulama
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400"
        >
          Giriş
        </Link>
        <Link
          href="/products"
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-50 transition hover:border-sky-500"
        >
          Ürünler
        </Link>
        <Link
          href="/products/1"
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-50 transition hover:border-sky-500"
        >
          Ürün Detayı
        </Link>
      </div>
    </main>
  );
}

