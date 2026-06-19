import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
        <section className="overflow-hidden bg-[var(--slot4-dark-bg)] px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-16">
          <div className="relative mx-auto grid min-h-[calc(100vh-16rem)] max-w-6xl gap-8 rounded-[2rem] bg-[linear-gradient(135deg,#090e24,#171342_55%,#4f2242)] p-6 shadow-[0_30px_90px_rgba(7,11,34,.22)] lg:grid-cols-[1.05fr_.95fr] lg:p-10">
            <div className="absolute right-[-6rem] top-[-7rem] h-80 w-80 rounded-full border-[30px] border-[#ff6b76] border-l-[#792ca2] opacity-70" />
            <div className="relative flex flex-col justify-center">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-white/55">{pagesContent.auth.login.badge}</p>
              <h1 className="mt-5 max-w-xl text-6xl font-black leading-[1.02] tracking-[-0.065em] sm:text-8xl">
                {pagesContent.auth.login.title}
              </h1>
              <p className="mt-6 max-w-lg text-sm font-semibold leading-8 text-white/72">{pagesContent.auth.login.description}</p>
              <div className="mt-10 hidden max-w-md grid-cols-2 gap-4 sm:grid">
                <div className="rounded-3xl border border-white/10 bg-white/7 p-5">
                  <p className="text-3xl font-black">01</p>
                  <p className="mt-2 text-sm font-semibold text-white/65">Open your publishing workspace.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/7 p-5">
                  <p className="text-3xl font-black">02</p>
                  <p className="mt-2 text-sm font-semibold text-white/65">Continue creating polished media releases.</p>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col justify-center rounded-[1.75rem] bg-white p-6 text-[var(--slot4-page-text)] shadow-2xl sm:p-8 lg:p-10">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#792ca2]">Member access</p>
                  <h2 className="mt-2 text-4xl font-black tracking-[-0.055em]">{pagesContent.auth.login.formTitle}</h2>
                </div>
                <span className="hidden h-14 w-14 rounded-full border-[8px] border-[#ff6b76] border-r-[#443199] border-t-[#d94fb1] sm:block" />
              </div>
              <EditableLocalLoginForm />
              <p className="mt-6 border-t border-black/10 pt-5 text-sm font-semibold text-black/60">New here? <Link href="/signup" className="font-black text-[#792ca2] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
