"use client";

import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) router.replace("/products");
  }, [user, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, expiresInMins: 30 })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Login failed.");
      }

      const data = await res.json();
      // rememberMe=true → localStorage (persists), false → sessionStorage (tab only)
      login(data, rememberMe);
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">

      {/* ── Left Panel (desktop only) ── */}
      <div className="hidden md:flex md:w-1/2 flex-col bg-[#F3F4F6] px-12 py-10 animate-slide-in-left">
        <div>
          <Image
            src="/images/octopus-logo.svg"
            alt="Octopus logo"
            width={190}
            height={38}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Image
            src="/images/login-illustration.svg"
            alt="Login illustration"
            width={380}
            height={340}
            className="object-contain"
          />
        </div>
        <div className="space-y-2 pb-4">
          <h2 className="text-xl font-bold leading-snug text-gray-900">
            Let Free Your Creativity with Our Intuitive Content Creator
          </h2>
          <p className="text-sm leading-relaxed text-gray-500">
            No design degree is required! Effortlessly craft and design stunning and
            captivating content using our user-friendly creative editor. With our
            drag-and-drop technology, anyone can create amazing marketing materials in.
          </p>
        </div>
      </div>

      {/* ── Mobile hero banner ── */}
      <div className="relative flex flex-col items-center overflow-hidden bg-[#F3F4F6] px-6 pb-10 pt-10 md:hidden animate-fade-in">
        {/* decorative circles */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#1DB800]/10" />
        <div className="absolute -left-6 top-16 h-24 w-24 rounded-full bg-[#1DB800]/8" />

        <Image
          src="/images/octopus-logo.svg"
          alt="Octopus logo"
          width={150}
          height={30}
          className="relative z-10 object-contain"
          priority
        />

        <div className="relative z-10 mt-5 flex items-end justify-center gap-4">
          <Image
            src="/images/login-illustration.svg"
            alt="Login illustration"
            width={180}
            height={160}
            className="object-contain"
          />
        </div>

        <p className="relative z-10 mt-4 text-center text-sm font-medium leading-snug text-gray-600">
          Manage your smart signage,<br />watch your company grow.
        </p>
      </div>

      {/* ── Right Panel / Form ── */}
      <div className="flex w-full flex-col justify-center bg-white px-6 py-8 dark:bg-gray-900 md:w-1/2 md:px-16 md:py-12 animate-slide-in-right">
        <div className="mb-8 space-y-1 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Octopus!</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue to your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1 animate-fade-up" style={{ animationDelay: "140ms" }}>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username<span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1DB800] focus:outline-none focus:ring-1 focus:ring-[#1DB800] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-1 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1DB800] focus:outline-none focus:ring-1 focus:ring-[#1DB800] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: "260ms" }}>
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#1DB800]"
            />
            <label htmlFor="remember" className="cursor-pointer select-none text-sm text-gray-600 dark:text-gray-400">
              Remember me?
            </label>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-[#1DB800] py-2.5 text-sm font-semibold text-white transition hover:bg-[#18a200] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 animate-fade-up"
            style={{ animationDelay: "320ms" }}
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
