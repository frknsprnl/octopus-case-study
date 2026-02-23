"use client";

import { useState, useEffect } from "react";
import ProductCard, { type Product } from "./ProductCard";
import Pagination from "@/components/ui/Pagination";

interface Category {
  slug: string;
  name: string;
}

const PAGE_SIZE = 9;

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // applied filter values (set when "Filter" is clicked)
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((r) => r.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      const skip = (page - 1) * PAGE_SIZE;

      try {
        let url: string;
        if (appliedSearch) {
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(appliedSearch)}&limit=${PAGE_SIZE}&skip=${skip}`;
        } else if (appliedCategories.length > 0) {
          url = `https://dummyjson.com/products/category/${appliedCategories[0]}?limit=${PAGE_SIZE}&skip=${skip}`;
        } else {
          url = `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Server error.");
        const data = await res.json();
        setProducts(data.products);
        setTotal(data.total);
      } catch {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, appliedSearch, appliedCategories]);

  function handleFilter() {
    setPage(1);
    setAppliedSearch(searchInput);
    setAppliedCategories(selectedCategories);
    setSidebarOpen(false);
  }

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* ── Mobile filter toggle ── */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        {!loading && !error && (
          <p className="text-sm font-semibold text-gray-900">{total} products found</p>
        )}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25" />
          </svg>
          Filters
          {(appliedCategories.length > 0 || appliedSearch) && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1DB800] text-[10px] font-bold text-white">
              {appliedCategories.length + (appliedSearch ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-48 shrink-0`}>
        {/* Quick search */}
        <div className="relative mb-5">
          <svg
            className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Quick search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-xs text-gray-700 placeholder:text-gray-400 focus:border-[#1DB800] focus:outline-none focus:ring-1 focus:ring-[#1DB800] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
          />
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-3 border-b border-gray-900 pb-2 text-sm font-semibold text-gray-900 dark:border-gray-600 dark:text-white">
            Categories
          </h3>
          <div className="space-y-2.5">
            {categories.slice(0, 10).map((cat) => (
              <label key={cat.slug} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 accent-[#1DB800]"
                />
                <span className="text-xs capitalize text-gray-700 dark:text-gray-300">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter button */}
        <button
          onClick={handleFilter}
          className="mt-5 w-full rounded-lg bg-gray-900 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Filter
        </button>
      </aside>

      {/* ── Main ── */}
      <div className={`flex-1 ${sidebarOpen ? "hidden md:block" : "block"}`}>
        {/* Count — desktop only (mobile shows it above) */}
        {!loading && !error && (
          <p className="mb-4 hidden text-sm font-semibold text-gray-900 dark:text-white md:block">
            {total} products found
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="skeleton-shimmer h-44 w-full" />
                <div className="space-y-2.5 p-3">
                  <div className="skeleton-shimmer h-3 w-3/4 rounded-full" />
                  <div className="skeleton-shimmer h-3 w-1/3 rounded-full" />
                  <div className="skeleton-shimmer h-3 w-1/4 rounded-full" />
                  <div className="mt-3 flex gap-2">
                    <div className="skeleton-shimmer h-8 flex-1 rounded-lg" />
                    <div className="skeleton-shimmer h-8 flex-1 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={handleFilter}
              className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <p className="py-20 text-center text-sm text-gray-400">
                No products found.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}

            <Pagination
              total={total}
              pageSize={PAGE_SIZE}
              currentPage={page}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        )}
      </div>
      </div>
    </div>
  );
}
