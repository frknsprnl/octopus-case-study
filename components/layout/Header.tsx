"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";


export default function Header() {
  const router = useRouter();
  const { user, logout: authLogout } = useAuth();
  const { cartCount, openCart } = useCart();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevCartCount = useRef(cartCount);
  const [badgePop, setBadgePop] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setBadgePop(true);
      setTimeout(() => setBadgePop(false), 400);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  function logout() {
    setTheme("light");
    authLogout();
    router.push("/login");
  }

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "?";

  const isDark = mounted && theme === "dark";

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900 md:px-8">
      {/* Logo */}
      <Link href="/products" className="flex flex-col gap-0.5">
        <Image
          src="/images/header-logo.svg"
          alt="Octopus"
          width={140}
          height={40}
          className="object-contain dark:brightness-0 dark:invert"
          priority
        />
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <button className="hidden h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:flex">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        {/* Help */}
        <button className="hidden h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:flex">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
        </button>

        {/* Notifications */}
        <button className="hidden h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:flex">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Cart */}
        <button
          onClick={openCart}
          className="relative flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          {cartCount > 0 && (
            <span
              key={cartCount}
              className={`absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1DB800] text-[10px] font-bold text-white ${badgePop ? "animate-badge-pop" : ""}`}
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative ml-2">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1DB800] text-[11px] font-bold text-white">
              {initials}
            </div>
            {user && (
              <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:inline">
                {user.firstName} {user.lastName}
              </span>
            )}
            <svg
              className={`h-3 w-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg animate-scale-in dark:border-gray-700 dark:bg-gray-800">
              {/* Dark mode toggle */}
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {isDark ? (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="5" />
                      <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                    Light Mode
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    Dark Mode
                  </>
                )}
              </button>

              <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

              {/* Logout */}
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
