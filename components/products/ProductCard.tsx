"use client";

import { useState } from "react";
import Link from "next/link";
import StarRating from "@/components/ui/StarRating";
import AddToCartModal from "@/components/ui/AddToCartModal";
import { useCart } from "@/contexts/CartContext";

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  thumbnail: string;
  rating: number;
}

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { cart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [added, setAdded] = useState(false);

  const cartQty = cart.products
    .filter((p) => p.id === product.id)
    .reduce((sum, p) => sum + p.quantity, 0);

  function handleAdded() {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <>
      <div
        className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-black/40 animate-fade-up"
        style={{ animationDelay: `${index * 55}ms` }}
      >
        <Link href={`/products/${product.id}`}>
          <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gray-100 p-4 dark:bg-gray-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
            />
            {cartQty > 0 && (
              <span
                key={cartQty}
                className="absolute right-2 top-2 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-[#1DB800] px-1.5 text-xs font-bold text-white shadow-md animate-badge-pop"
              >
                {cartQty}
              </span>
            )}
          </div>
        </Link>

        <div className="flex flex-col gap-1 p-3">
          <Link href={`/products/${product.id}`}>
            <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 transition-colors hover:text-[#1DB800] dark:text-white">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs capitalize text-gray-400 dark:text-gray-500">{product.category}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">${product.price.toLocaleString()}</p>
          <StarRating rating={product.rating} dark />

          <div className="mt-2 flex gap-2">
            {/* View Details — desktop only */}
            <Link
              href={`/products/${product.id}`}
              className="hidden flex-1 rounded-lg border border-gray-300 py-2 text-center text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-white md:block"
            >
              View Details
            </Link>

            {/* Add to Cart — desktop: opens modal */}
            <button
              onClick={() => setShowModal(true)}
              className={`hidden flex-1 rounded-lg py-2 text-xs font-semibold text-white transition-all duration-200 md:block ${
                added
                  ? "scale-95 bg-green-600"
                  : "bg-[#1DB800] hover:bg-[#18a200] active:scale-95"
              }`}
            >
              {added ? "✓ Added!" : "Add to Cart"}
            </button>

            {/* Add to Cart — mobile: goes to detail page */}
            <Link
              href={`/products/${product.id}`}
              className="flex-1 rounded-lg bg-[#1DB800] py-2 text-center text-xs font-semibold text-white transition hover:bg-[#18a200] active:scale-95 md:hidden"
            >
              Add to Cart
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <AddToCartModal
          product={product}
          onClose={() => setShowModal(false)}
          onAdded={handleAdded}
        />
      )}
    </>
  );
}
