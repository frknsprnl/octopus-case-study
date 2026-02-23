"use client";

import { useState } from "react";
import Link from "next/link";
import StarRating from "@/components/ui/StarRating";
import { useCart } from "@/contexts/CartContext";
import { PRODUCT_COLORS, PRODUCT_FEATURES } from "@/lib/productOptions";

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface DummyComment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

export interface ProductDetailData {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  thumbnail: string;
  rating: number;
  reviews: Review[];
}

const DUMMY_COLORS = PRODUCT_COLORS;
const DUMMY_FEATURES = PRODUCT_FEATURES;

const VISIBLE_REVIEWS = 2;

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-[#1DB800]" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const MAX_CHARS = 160;
  const isLong = review.comment.length > MAX_CHARS;

  return (
    <div className="py-4">
      <div className="mb-1 flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{review.reviewerName}</span>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {expanded || !isLong ? review.comment : `${review.comment.slice(0, MAX_CHARS)}...`}
        {isLong && !expanded && (
          <>
            {" "}
            <button
              onClick={() => setExpanded(true)}
              className="text-sm font-medium text-[#1DB800] hover:underline"
            >
              Show more
            </button>
          </>
        )}
      </p>
    </div>
  );
}

// externalComment disabled for now — using only product.reviews until comments API is clarified
export default function ProductDetail({
  product
}: {
  product: ProductDetailData;
  externalComment?: DummyComment | null;
}) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedFeature, setSelectedFeature] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      color: selectedColor,
      feature: DUMMY_FEATURES.find((f) => f.id === selectedFeature)?.title
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  const images = product.images?.length > 0 ? product.images : [product.thumbnail];
  const reviews = product.reviews ?? [];
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, VISIBLE_REVIEWS);

  return (
    <div className="pb-24">
      {/* Back button */}
      <div className="px-4 pt-5 md:px-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 px-4 py-6 md:grid-cols-[2fr_3fr] md:gap-10 md:px-10 md:py-8">

        {/* ── Left: Image Gallery ── */}
        <div>
          {/* Main image */}
          <div className="flex h-80 items-center justify-center overflow-hidden rounded-xl bg-gray-100 p-6 dark:bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={selectedImage}
              src={images[selectedImage]}
              alt={product.title}
              className="h-full w-full object-contain animate-fade-in"
            />
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-3">
            {images.slice(0, 3).map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-100 p-2 transition dark:bg-gray-800 ${
                  selectedImage === i
                    ? "border-gray-900 dark:border-gray-400"
                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Product Info ── */}
        <div className="space-y-6">
          {/* Title + Description */}
          <div>
            <h1 className="text-2xl font-bold leading-snug text-gray-900 dark:text-white">{product.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{product.description}</p>
          </div>

          {/* Color selection */}
          <div>
            <p className="mb-2.5 text-sm font-semibold text-gray-900 dark:text-white">Select Color:</p>
            <div className="flex gap-2">
              {DUMMY_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-900 transition dark:text-gray-200 ${
                    selectedColor === color.name
                      ? "border-gray-300 bg-white shadow-sm dark:border-gray-500 dark:bg-gray-700"
                      : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                  {selectedColor === color.name && <CheckIcon />}
                </button>
              ))}
            </div>
          </div>

          {/* Feature selection */}
          <div>
            <p className="mb-2.5 text-sm font-semibold text-gray-900 dark:text-white">Select Feature:</p>
            <div className="grid grid-cols-2 gap-2">
              {DUMMY_FEATURES.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature.id)}
                  className={`relative rounded-lg border p-3 text-left transition ${
                    selectedFeature === feature.id
                      ? "border-gray-300 bg-white shadow-sm dark:border-gray-500 dark:bg-gray-700"
                      : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                  }`}
                >
                  {selectedFeature === feature.id && (
                    <span className="absolute right-2 top-2">
                      <CheckIcon />
                    </span>
                  )}
                  <p className="pr-5 text-xs font-semibold text-gray-900 dark:text-gray-200">{feature.title}</p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{feature.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Product Reviews</p>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {/* External comment from /comments API — disabled; using only product.reviews */}
              {/* {externalComment && (
                <div className="py-4">
                  <div className="mb-1 flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {externalComment.user.fullName}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      {externalComment.likes} likes
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {externalComment.body}
                  </p>
                </div>
              )} */}
              {displayedReviews.map((review, i) => (
                <ReviewItem key={i} review={review} />
              ))}
              {reviews.length === 0 && (
                <p className="py-4 text-sm text-gray-400">No reviews yet.</p>
              )}
            </div>
            {!showAllReviews && reviews.length > VISIBLE_REVIEWS && (
              <button
                onClick={() => setShowAllReviews(true)}
                className="mt-3 rounded-lg bg-gray-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                View All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom sticky bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-3 px-4 py-3 md:gap-6 md:px-10 md:py-4">
          <p className="hidden w-32 shrink-0 text-sm font-bold text-gray-900 dark:text-white md:block">Order Summary</p>
          <div className="hidden min-w-0 flex-1 md:block">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{product.title}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{product.description}</p>
          </div>
          <div className="min-w-0 flex-1 md:hidden">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{product.title}</p>
          </div>
          <p className="shrink-0 text-lg font-bold text-gray-900 dark:text-white md:text-xl">
            ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <button
            onClick={handleAddToCart}
            className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 md:px-8 ${
              added
                ? "scale-95 bg-green-600"
                : "bg-[#1DB800] hover:bg-[#18a200] active:scale-95"
            }`}
          >
            {added ? "✓ Added to Cart!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
