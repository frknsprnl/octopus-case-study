import Header from "@/components/layout/Header";
import ProductList from "@/components/products/ProductList";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <ProductList />
    </div>
  );
}
