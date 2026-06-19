'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const mediaRoute = SITE_CONFIG.taskViews.mediaDistribution || '/media-distribution'

  return (
    <footer className="bg-[var(--slot4-dark-bg)] text-white">
      <section className="overflow-hidden border-b border-white/10 bg-[#11193a]">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.95fr_1fr] lg:px-8 lg:py-0">
          <div className="relative hidden min-h-[320px] lg:block">
            <div className="absolute left-6 top-10 h-[420px] w-[230px] rotate-[-15deg] rounded-[2.2rem] border-[10px] border-[#2b2f3e] bg-white shadow-2xl">
              <div className="mx-auto mt-5 h-5 w-24 rounded-full bg-[#111]" />
              <div className="m-5 mt-7 space-y-3">
                <div className="h-24 rounded-xl bg-[linear-gradient(135deg,#443199,#e05454)]" />
                <div className="h-3 rounded bg-slate-300" />
                <div className="h-3 w-4/5 rounded bg-slate-200" />
                <div className="h-28 rounded-xl bg-slate-100" />
              </div>
            </div>
            <div className="absolute left-48 top-12 h-64 w-64 rounded-full border-[26px] border-[#ff6b76] border-l-[#792ca2] opacity-90" />
          </div>
          <div className="flex flex-col justify-center py-6 lg:py-20">
            <h2 className="editorial-serif text-5xl font-black italic leading-none sm:text-6xl">Start Now</h2>
            <p className="mt-6 max-w-xl text-lg font-bold leading-8">Create, publish, and organize media releases with a polished magazine experience.</p>
            <Link href={session ? '/create' : '/signup'} className="mt-8 inline-flex w-fit rounded-full bg-white px-8 py-3.5 text-sm font-black text-[var(--slot4-dark-bg)] transition hover:bg-[#ffdce7]">
              {session ? 'Create a release' : 'Get Started'}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_.7fr_.7fr_.7fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="h-16 w-16 rounded-full border-[9px] border-[#ff6b76] border-r-[#443199] border-t-[#d94fb1]" />
              <span className="text-3xl font-black leading-none tracking-[-.05em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm font-semibold leading-7 text-white/75">{globalContent.footer?.description || SITE_CONFIG.description}</p>
            <form action="/signup" className="mt-8 flex max-w-md overflow-hidden rounded-full border border-white/25 bg-white/5">
              <input name="email" type="email" placeholder="Email updates" className="min-w-0 flex-1 bg-transparent px-5 py-3.5 text-sm outline-none placeholder:text-white/45" />
              <button className="bg-white px-5 text-sm font-black text-[var(--slot4-dark-bg)]">Join</button>
            </form>
          </div>
          <div>
            <h3 className="text-sm font-black">Advertisers</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <Link href={mediaRoute} className="hover:text-white">Media Distribution</Link>
              <Link href="/search" className="hover:text-white">Release Archive</Link>
              <Link href="/signup" className="hover:text-white">Get Started</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black">Company</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <Link href="/about" className="hover:text-white">About</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
              {session ? <button onClick={logout} className="text-left hover:text-white">Logout</button> : <Link href="/login" className="hover:text-white">Log In</Link>}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black">Resources</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <Link href="/search" className="group inline-flex items-center gap-2 hover:text-white">Search <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/comments" className="hover:text-white">Comments</Link>
              <Link href="/contact" className="hover:text-white">Help Center</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs font-bold text-white/45">© {year} {SITE_CONFIG.name}. Media releases and public information.</div>
    </footer>
  )
}
