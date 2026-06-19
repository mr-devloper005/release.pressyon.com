import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
        <section className="overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <div className="relative mx-auto grid max-w-[1320px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[.92fr_1.08fr] lg:px-8 lg:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_10%,rgba(224,84,84,.45),transparent_28rem),linear-gradient(130deg,#090e24,#171342_50%,#4f2242)]" />
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-white/55">{pagesContent.about.badge}</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.04] tracking-[-0.065em] sm:text-7xl">
                {pagesContent.about.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/72">{pagesContent.about.description}</p>
              <Link href="/search" className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-black text-[#090e24] transition hover:bg-[#ffdce7]">Explore the archive</Link>
            </div>
            <div className="relative z-10 hidden min-h-[360px] lg:block">
              <div className="press-device absolute right-10 top-2 h-[360px] w-[260px] rotate-[7deg]">
                <div className="h-full bg-white px-5 pb-5 pt-14 text-[#090e24]">
                  <div className="h-24 rounded-2xl bg-[linear-gradient(135deg,#443199,#c13383,#e05454)]" />
                  <div className="mt-5 space-y-3">
                    <div className="h-3 rounded bg-slate-200" />
                    <div className="h-3 w-5/6 rounded bg-slate-200" />
                    <div className="h-20 rounded-2xl border border-black/10 bg-[#f8f7ff]" />
                    <div className="h-20 rounded-2xl border border-black/10 bg-[#f8f7ff]" />
                  </div>
                </div>
              </div>
              <div className="absolute right-64 top-24 h-64 w-64 rounded-full border-[26px] border-[#ff6b76] border-l-[#792ca2] opacity-90" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
            <article className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(7,11,34,.08)] sm:p-8 lg:p-10">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#792ca2]">About {SITE_CONFIG.name}</p>
              <h2 className="mt-4 text-4xl font-black leading-[1.05] tracking-[-0.055em] sm:text-5xl">Clear structure for every story, release, and resource.</h2>
              <div className="mt-8 grid gap-5 text-base font-semibold leading-8 text-[var(--slot4-muted-text)]">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>

            <aside className="grid gap-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className="group rounded-[1.75rem] border border-black/10 bg-[#f4f2fb] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(7,11,34,.12)]">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--slot4-dark-bg)] text-sm font-black text-white">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-2xl font-black leading-tight tracking-[-0.04em]">{value.title}</h3>
                      <p className="mt-3 text-sm font-semibold leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </aside>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {['Reading', 'Discovery', 'Publishing'].map((item, index) => (
              <div key={item} className="rounded-[1.75rem] bg-[var(--slot4-dark-bg)] p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">0{index + 1}</p>
                <h3 className="mt-8 text-3xl font-black tracking-[-0.05em]">{item}</h3>
                <div className="mt-4 h-px bg-[linear-gradient(90deg,#792ca2,#e05454)]" />
                <p className="mt-4 text-sm font-semibold leading-7 text-white/65">A focused layer of the experience designed to keep visitors oriented and moving.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white pb-16">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] bg-[linear-gradient(135deg,#443199,#792ca2_45%,#e05454)] p-8 text-white sm:p-12 lg:p-16">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white/70">Keep exploring</p>
              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.055em] sm:text-5xl">Read the stories shaping the conversation.</h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/search" className="rounded-full bg-white px-8 py-4 text-base font-black text-[var(--slot4-dark-bg)]">Explore the archive</Link>
                <Link href="/contact" className="rounded-full border border-white/60 px-8 py-4 text-base font-black text-white transition hover:bg-white hover:text-[var(--slot4-dark-bg)]">Contact</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
