import Link from "next/link"
import { ArrowRight, BarChart3, Bot, Check, CheckCircle2, ClipboardList, Package, ShoppingBag, Smartphone, Users } from "lucide-react"

const features = [
  { icon: ShoppingBag, title: "From stock to sale", text: "Manage your product catalog, record sales and keep inventory up to date in one place." },
  { icon: Users, title: "A workspace for your team", text: "Bring owners, managers and employees together with access that fits their responsibilities." },
  { icon: BarChart3, title: "See the bigger picture", text: "Review sales, expenses and business reports to understand what's happening across your operation." },
  { icon: Bot, title: "Help when you need it", text: "Ask the AI assistant questions about your business reports and uploaded documents." },
]

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 selection:bg-blue-100">
      <a href="#main-content" className="sr-only z-50 rounded-lg bg-white px-4 py-3 font-semibold text-blue-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <header className="border-b border-slate-200 bg-white">
        <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" aria-label="SmartERP home" className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4">
            <span className="text-lg font-bold tracking-tight">SmartERP<span className="ml-1 text-blue-600">AI</span></span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="#features" className="hidden min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-600 hover:text-blue-700 md:inline-flex">Explore features</a>
            <Link href="/login" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">Sign in</Link>
            <Link href="/register" className="hidden min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 sm:inline-flex">Get started</Link>
          </div>
        </nav>
      </header>
      <main id="main-content">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-24">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800"><span className="size-1.5 rounded-full bg-blue-600" aria-hidden="true" />Built for growing businesses</p>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">Run your entire business.<br /><span className="text-blue-700">Keep it all connected.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">Products, sales, people and reports. One clear workspace for your day-to-day work, on the web and on the go.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4">Create your workspace<ArrowRight className="size-4" aria-hidden="true" /></Link>
              <a href="#features" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">Explore the workspace</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">{["Web & mobile", "Role-based access", "Connected workflows"].map((item) => <span key={item} className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-blue-600" aria-hidden="true" />{item}</span>)}</div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/5 sm:p-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <p className="text-sm font-semibold">Your workspace</p>
              <span className="text-xs text-slate-500">Preview</span>
            </div>
            <div className="py-5">
              <p className="text-xl font-semibold tracking-tight">A clearer working day</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Your daily operations, connected in one place.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ icon: Package, title: "Inventory", detail: "Know what's in stock", color: "bg-blue-50 text-blue-700" }, { icon: ShoppingBag, title: "Sales", detail: "Record every sale", color: "bg-emerald-50 text-emerald-700" }, { icon: Users, title: "Your team", detail: "Work better together", color: "bg-amber-50 text-amber-700" }, { icon: ClipboardList, title: "Tasks", detail: "Keep work moving", color: "bg-slate-100 text-slate-700" }].map(({ icon: Icon, title, detail, color }) => <div key={title} className="rounded-xl border border-slate-200 p-3.5 sm:p-4"><span className={`grid size-9 place-items-center rounded-lg ${color}`}><Icon className="size-4" aria-hidden="true" /></span><p className="mt-3 text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div>)}
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-900 p-4 text-white"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-800 text-blue-200"><Bot className="size-5" aria-hidden="true" /></span><div><p className="text-sm font-medium">Ask your business assistant</p><p className="mt-1 text-xs leading-5 text-slate-300">Find answers in your business data.</p></div></div>
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Smartphone className="size-4 text-blue-600" aria-hidden="true" />Stay connected from your phone or desktop.</p>
          </div>
        </section>

        <section id="features" className="scroll-mt-8 border-y border-slate-200 bg-white px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl"><p className="text-sm font-semibold text-blue-700">Less switching. More doing.</p><h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">The tools your business needs, working together.</h2><p className="mt-4 text-base leading-7 text-slate-600">Build a daily routine around your business, with a shared view for everyone on your team.</p></div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><span className="grid size-11 place-items-center rounded-xl border border-blue-100 bg-white text-blue-700"><Icon className="size-5" aria-hidden="true" /></span><h3 className="mt-5 text-base font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</div>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 rounded-3xl bg-slate-900 p-7 text-white sm:p-10 lg:flex-row lg:items-center">
            <div className="max-w-xl"><CheckCircle2 className="mb-4 size-7 text-blue-300" aria-hidden="true" /><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Give your business a place to grow.</h2><p className="mt-3 text-sm leading-6 text-slate-300">Create your workspace, add your products and bring your team on board.</p></div>
            <Link href="/register" className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-blue-50 sm:w-auto">Get started<ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 pb-8 text-xs leading-5 text-slate-500 sm:px-8"><p>SmartERP AI · Your everyday business workspace</p><Link href="/login" className="rounded-md py-2 font-medium text-slate-700 hover:text-blue-700">Sign in to your account</Link></footer>
    </div>
  )
}
