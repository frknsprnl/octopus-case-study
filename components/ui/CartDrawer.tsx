"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [ordered, setOrdered] = useState(false);

  // Reset success screen when drawer is closed
  useEffect(() => {
    if (!isOpen) {
      const id = setTimeout(() => setOrdered(false), 300);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  function handleCheckout() {
    clearCart();
    setOrdered(true);
    // Auto-close after 2.8s
    setTimeout(() => closeCart(), 2800);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-gray-900 sm:w-96 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {ordered ? "Order Confirmed" : "Cart"}
            </h2>
            {!ordered && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[11px] font-bold text-white dark:bg-gray-700">
                {cart.products.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success screen */}
        {ordered ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            {/* Animated checkmark */}
            <svg viewBox="0 0 100 100" className="h-28 w-28" fill="none">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#1DB800"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="283"
                style={{
                  animation: "check-circle 0.65s cubic-bezier(0.65,0,0.35,1) forwards"
                }}
              />
              <path
                d="M28 52 L44 68 L72 34"
                stroke="#1DB800"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="60"
                strokeDashoffset="60"
                style={{
                  animation: "check-mark 0.45s ease 0.6s forwards"
                }}
              />
            </svg>

            {/* Message */}
            <div style={{ animation: "fade-up 0.4s ease 0.75s both" }}>
              <p className="text-xl font-bold text-gray-900">Order Placed!</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.products.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-center animate-fade-up">
                  <svg
                    className="h-14 w-14 text-gray-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-400 dark:text-gray-600">Your cart is empty.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {cart.products.map((item, i) => (
                    <div
                      key={item.cartKey}
                      className="flex gap-3 py-4 animate-fade-up"
                      style={{ animationDelay: `${i * 45}ms` }}
                    >
                      {/* Thumbnail */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 p-1.5 dark:bg-gray-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-xs font-medium leading-snug text-gray-900 dark:text-white">
                          {item.title}
                        </p>
                        {(item.color || item.feature) && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.color && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                <span className="h-2 w-2 rounded-full border border-gray-300" style={{ backgroundColor: item.color === "Black" ? "#1A1A1A" : "#A8A8A8" }} />
                                {item.color}
                              </span>
                            )}
                            {item.feature && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                {item.feature}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Quantity stepper */}
                        <div className="mt-2 flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-500 transition hover:border-gray-400 hover:text-gray-900 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-400 dark:hover:text-white"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="min-w-[1.5rem] text-center text-xs font-semibold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-500 transition hover:border-gray-400 hover:text-gray-900 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-400 dark:hover:text-white"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.cartKey)}
                        className="self-start pt-0.5 text-gray-300 transition hover:text-red-400"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.products.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-700">
            <div className="mb-1 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>{cart.totalQuantities} item{cart.totalQuantities !== 1 ? "s" : ""}</span>
                </div>
                <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">${cart.total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-lg bg-[#1DB800] py-3 text-sm font-semibold text-white transition hover:bg-[#18a200]"
                >
                  Checkout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
