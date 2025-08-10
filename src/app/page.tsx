"use client";

import { FormEvent, useState } from "react";

type Errors = Partial<{ name: string; phone: string }>;

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const next: Errors = {};
    if (!name.trim()) next.name = "El nombre es obligatorio";

    const phoneClean = phone.trim();
    const phoneOk = /^[+0-9()\-\s]{7,}$/.test(phoneClean);
    if (!phoneClean) next.phone = "El teléfono es obligatorio";
    else if (!phoneOk) next.phone = "Teléfono no válido";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSuccess(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });

      const data: { error?: string; details?: string } = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Error al enviar. Inténtalo de nuevo.");
      }
      setMessage("¡Inscripción enviada correctamente! Te contactaremos pronto.");
      setIsSuccess(true);
      setName("");
      setPhone("");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Algo salió mal. Inténtalo de nuevo.";
      setMessage(msg);
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

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <header className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm">
            Taller informativo
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display, var(--font-geist-sans))" }}>
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              INSCRIPCIÓN A TALLER EDUACION FINANCIERA
            </span>
          </h1>
          <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600/70 via-sky-500/70 to-indigo-600/70" />
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Completa tus datos y te confirmamos por teléfono.
          </p>
        </header>

        {/* Form card */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-sky-200/70 via-indigo-200/70 to-rose-200/70 shadow-xl transition duration-300 hover:shadow-2xl hover:shadow-indigo-200/40">
          <div className="bg-white/90 backdrop-blur rounded-2xl ring-1 ring-slate-200/80 p-5 sm:p-6 md:p-8">
            <form className="space-y-6" onSubmit={handleSubmit} aria-describedby="form-status">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Nombre completo <span className="text-rose-600">*</span>
                  </label>
                  <svg aria-hidden className="pointer-events-none absolute left-3 top-[52px] h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "err-name" : undefined}
                    className={`mt-2 w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-100 ${errors.name ? "border-rose-400" : "border-slate-300/90 focus:border-sky-500"}`}
                  />
                  {errors.name && (
                    <p id="err-name" className="mt-1 text-xs text-rose-600">{errors.name}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                    Teléfono <span className="text-rose-600">*</span>
                  </label>
                  <svg aria-hidden className="pointer-events-none absolute left-3 top-[52px] h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                    className={`mt-2 w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-100 ${errors.phone ? "border-rose-400" : "border-slate-300/90 focus:border-sky-500"}`}
                  />
                  {errors.phone && (
                    <p id="err-phone" className="mt-1 text-xs text-rose-600">{errors.phone}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">Solo usaremos tu número para confirmar tu asistencia.</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-sky-50 text-sky-800 ring-1 ring-sky-200 px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 1.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V2.5A.75.75 0 0112 1.75zM4.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H5.5A.75.75 0 014.75 12zm12.25-.75h1.5a.75.75 0 010 1.5H17a.75.75 0 010-1.5zM6.22 6.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06L6.22 7.28a.75.75 0 010-1.06zm9.44 0a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM12 18.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  <span>Datos mínimos, respuesta rápida.</span>
                </div>
                <span className="text-xs text-slate-500">≈ 10s</span>
              </div>

              <div className="flex items-center gap-3">
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
                <span className="text-xs text-slate-500">Tus datos se envían de forma segura.</span>
              </div>

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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
