import Link from "next/link"
import { ArrowRight, BarChart3, Bot, Check, Layers3, ShieldCheck, Sparkles, Users2, Zap } from "lucide-react"

const features = [
  { icon: BarChart3, title: "Live business intelligence", text: "Turn sales, inventory, expenses, customers and tasks into decisions you can act on." },
  { icon: Bot, title: "AI that knows your business", text: "Ask questions across reports and uploaded documents with traceable source citations." },
  { icon: Users2, title: "One workspace, every role", text: "Owners, managers and employees each get the tools and visibility they need." },
]

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] text-white selection:bg-cyan-300 selection:text-slate-950">
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-blue-500/20"><Layers3 className="size-5" /></span>
          <span className="font-headline text-lg font-bold tracking-tight">SmartERP <span className="text-cyan-300">AI</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white">Sign in</Link>
          <Link href="/register" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-100">Start free</Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-14 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:pb-32 lg:pt-24">
        <div className="absolute -left-44 top-0 size-[460px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold text-cyan-200"><Sparkles className="size-3.5" /> Built for ambitious African SMEs</div>
          <h1 className="max-w-3xl font-headline text-5xl font-bold leading-[1.04] tracking-[-.045em] sm:text-6xl lg:text-7xl">Run your entire business from <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">one intelligent workspace.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">SmartERP connects your sales, stock, teams, customers and financial reports—then adds an AI copilot that understands the full picture.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 font-bold text-slate-950 shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5">Create your workspace <ArrowRight className="size-4" /></Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold backdrop-blur transition hover:bg-white/10">Sign in to your account</Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">{["Free to start", "Secure role access", "Web + mobile"].map(item => <span key={item} className="flex items-center gap-2"><Check className="size-4 text-emerald-400" />{item}</span>)}</div>
        </div>

        <div className="relative z-10">
          <div className="absolute inset-8 rounded-full bg-cyan-400/20 blur-[90px]" />
          <div className="relative rounded-[28px] border border-white/10 bg-[#0c1728]/90 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3">
              <div className="flex gap-1.5"><i className="size-2.5 rounded-full bg-rose-400"/><i className="size-2.5 rounded-full bg-amber-300"/><i className="size-2.5 rounded-full bg-emerald-400"/></div>
              <span className="text-[10px] font-bold uppercase tracking-[.22em] text-slate-500">Executive overview</span>
            </div>
            <div className="grid grid-cols-2 gap-3 py-3 sm:grid-cols-4">
              {[["Revenue","38.4M","+18%"],["Customers","1,284","+12%"],["Orders","3,906","+24%"],["Tasks","94%","On track"]].map(([label,value,trend]) => <div key={label} className="rounded-2xl border border-white/5 bg-white/[.035] p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 text-xl font-bold">{value}</p><p className="mt-1 text-[10px] font-semibold text-emerald-400">{trend}</p></div>)}
            </div>
            <div className="grid gap-3 sm:grid-cols-[1.55fr_1fr]">
              <div className="rounded-2xl border border-white/5 bg-white/[.035] p-4">
                <div className="mb-5 flex items-center justify-between"><span className="text-xs font-bold">Revenue pulse</span><span className="text-[10px] text-slate-500">Last 7 months</span></div>
                <svg viewBox="0 0 500 165" className="w-full" aria-label="Rising revenue chart"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#22d3ee" stopOpacity=".35"/><stop offset="1" stopColor="#22d3ee" stopOpacity="0"/></linearGradient></defs><path d="M0 140 C45 120 65 132 105 104 S165 95 205 78 S265 100 305 59 S365 62 405 34 S465 39 500 10 L500 165 L0 165Z" fill="url(#area)"/><path d="M0 140 C45 120 65 132 105 104 S165 95 205 78 S265 100 305 59 S365 62 405 34 S465 39 500 10" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round"/></svg>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[.035] p-4"><p className="text-xs font-bold">AI focus</p><div className="mt-4 space-y-3">{["Restock 4 fast movers","Follow up 12 customers","Review overdue invoices"].map((x,i)=><div key={x} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-[10px] font-bold text-cyan-300">{i+1}</span><p className="text-xs leading-5 text-slate-300">{x}</p></div>)}</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[.025] px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.24em] text-cyan-300">Everything connected</p><h2 className="mt-3 font-headline text-3xl font-bold tracking-tight sm:text-4xl">Less busywork. Better decisions. Faster growth.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-3">{features.map(({icon:Icon,title,text})=><article key={title} className="rounded-3xl border border-white/10 bg-[#0b1727] p-7 transition hover:-translate-y-1 hover:border-cyan-300/30"><span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300"><Icon /></span><h3 className="mt-6 text-lg font-bold">{title}</h3><p className="mt-3 leading-7 text-slate-400">{text}</p></article>)}</div></div>
      </section>

      <section className="px-5 py-24 text-center lg:px-8"><ShieldCheck className="mx-auto size-10 text-emerald-400"/><h2 className="mx-auto mt-5 max-w-2xl font-headline text-3xl font-bold sm:text-4xl">Your next level of operations starts here.</h2><p className="mx-auto mt-4 max-w-xl text-slate-400">Create your secure company workspace and bring your entire operation into focus.</p><Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-slate-950">Get started free <Zap className="size-4" /></Link></section>
    </main>
  )
}
