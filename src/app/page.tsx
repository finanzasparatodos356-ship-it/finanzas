"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSuccess(null);

    if (!name.trim() || !phone.trim()) {
      setMessage("Por favor, completa nombre y teléfono.");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Error al enviar. Inténtalo de nuevo.");
      }
      setMessage("¡Inscripción enviada correctamente! Te contactaremos pronto.");
      setIsSuccess(true);
      setName("");
      setPhone("");
    } catch (error: any) {
      setMessage(error?.message ?? "Algo salió mal. Inténtalo de nuevo.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen isolate overflow-hidden bg-gradient-to-br from-[#eef7ff] via-[#faf5ff] to-[#fff1f2] text-slate-900">
      {/* Deep layered background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(1200px_600px_at_10%_-10%,rgba(56,189,248,0.35),transparent_60%),radial-gradient(1000px_560px_at_90%_-10%,rgba(167,139,250,0.35),transparent_60%),radial-gradient(800px_600px_at_50%_110%,rgba(244,114,182,0.26),transparent_60%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-black/5" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -top-16 -translate-x-1/2 blur-3xl [mask-image:radial-gradient(closest-side,white,transparent)]"
      >
        <div className="h-72 w-[60rem] bg-[conic-gradient(from_120deg_at_50%_50%,#38bdf8_0%,#a78bfa_30%,#f472b6_60%,#38bdf8_100%)] opacity-25 rounded-full animate-slow-rotate" />
      </div>
      {/* Subtle grid overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-mask" />

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
        {/* Hero with image + title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center mb-8 sm:mb-12">
          <div>
            <header className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm">
                Taller informativo
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display, var(--font-geist-sans))" }}>
                <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                  INSCRIPCIÓN A TALLER EDUACION FINANCIERA
                </span>
              </h1>
              <div className="mx-auto md:mx-0 mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600/70 via-sky-500/70 to-indigo-600/70" />
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                Completa tus datos y te confirmamos por teléfono.
              </p>
            </header>
          </div>

          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-sky-200/60 via-indigo-200/60 to-rose-200/60 blur-xl"></div>
            <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200/80 shadow-xl">
              <Image
                src="/foto_presentacion.jpeg"
                alt="Taller educación financiera"
                width={900}
                height={900}
                priority
                className="object-cover aspect-[4/5] md:aspect-[5/4]"
              />
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-sky-200/70 via-indigo-200/70 to-rose-200/70 shadow-xl transition duration-300 hover:shadow-2xl hover:shadow-indigo-200/40">
          <div className="bg-white/90 backdrop-blur rounded-2xl ring-1 ring-slate-200/80 p-5 sm:p-6 md:p-8">
            <form className="space-y-5" onSubmit={handleSubmit} aria-describedby="form-status">
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Nombre completo <span className="text-rose-600">*</span>
                </label>
                <svg
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-[52px] h-5 w-5 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 22c0-3.866 3.582-7 9-7s9 3.134 9 7" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre y apellidos"
                  className="mt-2 w-full rounded-xl border border-slate-300/90 bg-white pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500"
                />
              </div>

              <div className="relative">
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Teléfono <span className="text-rose-600">*</span>
                </label>
                <svg
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-[52px] h-5 w-5 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.11.37 2.31.57 3.56.57a1 1 0 011 1v3.5a1 1 0 01-1 1C11.85 22 2 12.15 2 0.999A1 1 0 013 0h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.56a1 1 0 01-.24 1.01l-2.2 2.2Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. +34 600 000 000"
                  className="mt-2 w-full rounded-xl border border-slate-300/90 bg-white pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500"
                />
                <p className="mt-1 text-xs text-slate-500">Solo usaremos tu número para confirmar tu asistencia.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-white font-semibold shadow-lg shadow-blue-600/20 ring-1 ring-blue-600/20 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-sky-100"
              >
                {isLoading && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {isLoading ? "Enviando…" : "Enviar inscripción"}
              </button>

              <div id="form-status" aria-live="polite">
                {message && (
                  <div
                    className={`mt-3 rounded-xl px-4 py-3 text-sm font-medium ${
                      isSuccess ? "bg-green-50 text-green-700 ring-1 ring-green-200" : "bg-red-50 text-red-700 ring-1 ring-red-200"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Al enviar aceptas ser contactado/a para información del taller. No compartiremos tus datos con terceros.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
