"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { PRODUCT_COLORS, PRODUCT_FEATURES } from "@/lib/productOptions";
import type { Product } from "@/components/products/ProductCard";

interface Props {
  product: Product;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddToCartModal({ product, onClose, onAdded }: Props) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>(PRODUCT_COLORS[1].name);
  const [selectedFeature, setSelectedFeature] = useState<number>(PRODUCT_FEATURES[0].id);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleConfirm() {
    const feature = PRODUCT_FEATURES.find((f) => f.id === selectedFeature);
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      color: selectedColor,
      feature: feature?.title
    });
    onAdded();
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 animate-scale-in">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">

          {/* Header */}
          <div className="flex items-start gap-3 border-b border-gray-100 p-4 dark:border-gray-700">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 p-2 dark:bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.thumbnail} alt={product.title} className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 dark:text-white">
                {product.title}
              </p>
              <p className="mt-0.5 text-sm font-bold text-[#1DB800]">${product.price.toLocaleString()}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 p-4">
            {/* Color */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Color
              </p>
              <div className="flex gap-2">
                {PRODUCT_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      selectedColor === color.name
                        ? "border-gray-900 bg-gray-50 text-gray-900 shadow-sm dark:border-gray-300 dark:bg-gray-700 dark:text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                    {selectedColor === color.name && (
                      <svg className="h-3 w-3 text-[#1DB800]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Feature
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PRODUCT_FEATURES.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setSelectedFeature(feature.id)}
                    className={`relative rounded-lg border p-2.5 text-left transition ${
                      selectedFeature === feature.id
                        ? "border-gray-900 bg-gray-50 shadow-sm dark:border-gray-300 dark:bg-gray-700"
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500"
                    }`}
                  >
                    {selectedFeature === feature.id && (
                      <span className="absolute right-2 top-2">
                        <svg className="h-3 w-3 text-[#1DB800]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    <p className="pr-4 text-xs font-semibold text-gray-900 dark:text-white">{feature.title}</p>
                    <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{feature.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-4 dark:border-gray-700">
            <button
              onClick={handleConfirm}
              className="w-full rounded-lg bg-[#1DB800] py-2.5 text-sm font-semibold text-white transition hover:bg-[#18a200] active:scale-[0.98]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
