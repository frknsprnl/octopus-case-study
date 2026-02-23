interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <main className="flex flex-1 flex-col">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Ürün Detayı &mdash; #{params.id}
        </h1>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
        Ürün detay içeriği
      </section>
    </main>
  );
}

