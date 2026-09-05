import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight, Check, Package, ShieldCheck, Users } from "lucide-react"

export const authInputClass = "h-12 rounded-xl border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 sm:text-sm"

export function AuthFrame({ children, mode = "login" }: { children: ReactNode; mode?: "login" | "register" | "reset" }) {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:py-7">
        <Link href="/" aria-label="SmartERP home" className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4">
          <span className="text-lg font-bold tracking-tight">SmartERP<span className="ml-1 text-blue-600">AI</span></span>
        </Link>
        <Link href={mode === "register" ? "/login" : "/register"} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
          {mode === "register" ? "Sign in" : "Get started"}<ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </header>
      <main id="main-content" className="mx-auto grid max-w-7xl items-start gap-10 px-5 pb-10 pt-3 sm:px-8 sm:pt-6 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:pb-16">
        <aside className="relative hidden overflow-hidden rounded-[2rem] bg-slate-900 p-10 text-white lg:sticky lg:top-8 lg:flex lg:min-h-[670px] lg:flex-col xl:p-12" aria-label="About your workspace">
          <p className="text-sm font-medium text-blue-200">Your business, connected.</p>
          <h2 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-tight">More clarity.<br />Room to grow.</h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-slate-300">Keep your products, sales and people together, wherever the work takes you.</p>
          <div className="my-10 rounded-2xl border border-slate-700 bg-slate-800/70 p-5">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
              <div><p className="text-sm font-semibold">One shared workspace</p><p className="mt-1 text-xs text-slate-400">Built around your business</p></div>
            </div>
            <div className="mt-4 space-y-4">
              {[{ icon: Package, title: "Products & sales", text: "Track stock and keep selling." }, { icon: Users, title: "Your people", text: "Give everyone the access they need." }, { icon: ShieldCheck, title: "A clear overview", text: "Stay on top of daily operations." }].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-blue-200" aria-hidden="true" />
                  <div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-auto flex items-center gap-2 text-sm text-slate-300"><Check className="size-4 text-blue-300" aria-hidden="true" />Available on web and mobile</p>
        </aside>
        <section className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:my-6 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">{children}</section>
      </main>
      <footer className="mx-auto max-w-7xl px-5 pb-6 text-center text-xs leading-5 text-slate-500 sm:px-8">SmartERP AI · Your everyday business workspace</footer>
    </div>
  )
}

export function AuthMessage({ children, variant = "error", id }: { children: ReactNode; variant?: "error" | "success"; id?: string }) {
  return <div id={id} role={variant === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm leading-6 ${variant === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{children}</div>
}
