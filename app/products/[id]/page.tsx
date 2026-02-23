import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import ProductDetail, { type ProductDetailData } from "@/components/products/ProductDetail";

interface Props {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const productRes = await fetch(`https://dummyjson.com/products/${params.id}`, {
    next: { revalidate: 60 }
  });

  // Comments API disabled for now — using only product.reviews. Re-enable when clarified.
  // const [productRes, commentRes] = await Promise.all([
  //   fetch(`https://dummyjson.com/products/${params.id}`, { next: { revalidate: 60 } }),
  //   fetch(`https://dummyjson.com/comments/${params.id}`, { next: { revalidate: 60 } })
  // ]);
  // const commentData = commentRes.ok ? await commentRes.json() : null;
  // const externalComment: DummyComment | null =
  //   commentData && !commentData.message ? commentData : null;

  if (!productRes.ok) notFound();

  const product: ProductDetailData = await productRes.json();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <ProductDetail product={product} />
    </div>
  );
}
