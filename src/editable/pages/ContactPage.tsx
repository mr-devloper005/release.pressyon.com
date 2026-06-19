'use client'

import { FileText, Mail, Megaphone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const desks = [
  { icon: FileText, title: 'Editorial desk', body: 'Send story ideas, corrections, source material, and publication questions.' },
  { icon: Megaphone, title: 'Media partnerships', body: 'Discuss distribution, syndication, newsroom collaborations, and campaigns.' },
  { icon: Mail, title: 'General support', body: 'Reach the team for account, publishing, or site-related help.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f7f4ef] text-[#111]">
        <section className="border-b border-black bg-white">
          <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c92f2f]">{pagesContent.contact.eyebrow}</p>
            <h1 className="editorial-brand mt-4 max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.055em] sm:text-7xl lg:text-8xl">{pagesContent.contact.title}</h1>
            <p className="mt-6 max-w-2xl border-l-4 border-[#c92f2f] pl-5 text-base font-semibold leading-8 text-black/65">{pagesContent.contact.description}</p>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto grid max-w-[1320px] overflow-hidden border border-black bg-white lg:grid-cols-[0.78fr_1.22fr]">
            <aside className="border-b border-black bg-[#171717] text-white lg:border-b-0 lg:border-r">
              {desks.map((desk, index) => (
                <div key={desk.title} className="border-b border-white/25 p-6 last:border-b-0 sm:p-8">
                  <div className="flex items-center justify-between"><desk.icon className="h-5 w-5 text-[#f34a43]" /><span className="text-xs font-black text-white/45">0{index + 1}</span></div>
                  <h2 className="editorial-serif mt-5 text-2xl font-black sm:text-3xl">{desk.title}</h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/65">{desk.body}</p>
                </div>
              ))}
            </aside>
            <div className="mx-auto w-full max-w-3xl p-6 sm:p-10 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c92f2f]">Send a message</p>
              <h2 className="editorial-serif mt-3 text-4xl font-black">{pagesContent.contact.formTitle}</h2>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
