'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = [
    { label: 'Archive', href: '/search' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[var(--slot4-dark-bg)] text-white shadow-[0_1px_0_rgba(255,255,255,.08)]">
      <div className="bg-[#4b00c8]">
        <div className="mx-auto flex min-h-10 max-w-[1320px] items-center justify-center px-4 text-center text-xs font-bold sm:text-sm">
          <span>{SITE_CONFIG.name} helps media distributors turn every release into a polished public moment.</span>
        </div>
      </div>

      <div className="mx-auto flex min-h-[70px] max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="relative h-10 w-10 shrink-0 rounded-full border-[6px] border-[#ff6b76] border-r-[#443199] border-t-[#d94fb1] transition group-hover:rotate-45" />
          <span className="min-w-0 text-sm font-black leading-[.95] tracking-[-.04em] sm:text-base">
            <span className="block truncate">{SITE_CONFIG.name}</span>
            <span className="block text-[10px] font-bold text-white/55">media release studio</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="inline-flex items-center gap-2 text-sm font-black transition hover:text-[#ff7482]">
              {item.label} <ChevronDown className="h-4 w-4" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <form action="/search" className="hidden items-center rounded-full border border-white/20 px-4 lg:flex">
            <Search className="h-4 w-4 text-white/60" />
            <input name="q" type="search" placeholder="Search" className="w-20 bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-white/45" />
          </form>
          <Link href={session ? '/create' : '/signup'} className="rounded-full bg-white px-6 py-3 text-sm font-black text-[var(--slot4-dark-bg)] transition hover:bg-[#ffdce7]">
            {session ? 'Publish' : 'Get Started'}
          </Link>
          {session ? (
            <button type="button" onClick={logout} className="rounded-full border border-white/55 px-6 py-3 text-sm font-black transition hover:bg-white hover:text-[var(--slot4-dark-bg)]">Logout</button>
          ) : <Link href="/login" className="rounded-full border border-white/55 px-6 py-3 text-sm font-black transition hover:bg-white hover:text-[var(--slot4-dark-bg)]">Log In</Link>}
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 lg:hidden" aria-label="Toggle navigation">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#0d132d] px-4 py-4 lg:hidden">
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...navItems, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => (
              <Link key={`${item.label}-${item.href}`} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl bg-white/7 px-4 py-3 text-sm font-black">{item.label}</Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
