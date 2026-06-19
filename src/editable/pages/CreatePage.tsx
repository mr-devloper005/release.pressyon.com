'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm font-bold text-[var(--slot4-page-text)] shadow-sm outline-none transition placeholder:text-black/35 focus:border-[#792ca2] focus:ring-4 focus:ring-[#792ca2]/10'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
          <section className="overflow-hidden bg-[var(--slot4-dark-bg)] px-4 py-16 text-white sm:px-6 lg:px-8">
            <div className="relative mx-auto grid max-w-6xl gap-10 rounded-[2rem] bg-[linear-gradient(135deg,#090e24,#171342_55%,#4f2242)] p-6 shadow-[0_30px_90px_rgba(7,11,34,.22)] md:grid-cols-[0.9fr_1.1fr] md:p-10 lg:p-12">
              <div className="absolute right-[-5rem] top-[-6rem] h-72 w-72 rounded-full border-[28px] border-[#ff6b76] border-l-[#792ca2] opacity-70" />
              <div className="relative flex min-h-80 items-center justify-center rounded-[1.8rem] border border-white/10 bg-white/7">
                <div className="absolute h-44 w-44 rounded-full bg-[linear-gradient(135deg,#443199,#c13383,#e05454)] blur-2xl opacity-50" />
                <div className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] bg-white text-[#090e24] shadow-2xl">
                  <Lock className="h-16 w-16" />
                </div>
              </div>
              <div className="relative self-center">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-white/55">{pagesContent.create.locked.badge}</p>
                <h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-[-0.065em] sm:text-7xl">{pagesContent.create.locked.title}</h1>
                <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-white/72">{pagesContent.create.locked.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-[#090e24] transition hover:bg-[#ffdce7]">Login <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-white/45 px-7 py-3.5 text-sm font-black text-white transition hover:bg-white hover:text-[#090e24]">Sign up</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
        <section className="overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <div className="relative mx-auto grid max-w-[1320px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_10%,rgba(224,84,84,.45),transparent_28rem),linear-gradient(130deg,#090e24,#171342_50%,#4f2242)]" />
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-white/55">{pagesContent.create.hero.badge}</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.065em] sm:text-7xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-white/72">{pagesContent.create.hero.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-[#090e24]">{activeTask?.label || 'Post'} workspace</span>
                <span className="rounded-full border border-white/35 px-5 py-2.5 text-sm font-black text-white/80">{session.name}</span>
              </div>
            </div>
            <div className="relative z-10 hidden min-h-[360px] lg:block">
              <div className="press-device absolute right-10 top-2 h-[360px] w-[260px] rotate-[7deg]">
                <div className="h-full bg-white px-5 pb-5 pt-14 text-[#090e24]">
                  <div className="space-y-3">
                    <div className="h-24 rounded-2xl bg-[linear-gradient(135deg,#443199,#c13383,#e05454)]" />
                    <div className="h-3 rounded bg-slate-200" />
                    <div className="h-3 w-4/5 rounded bg-slate-200" />
                    <div className="mt-5 grid gap-2">
                      <div className="h-14 rounded-xl border border-black/10 bg-white" />
                      <div className="h-14 rounded-xl border border-black/10 bg-white" />
                      <div className="h-14 rounded-xl border border-black/10 bg-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute right-64 top-24 h-64 w-64 rounded-full border-[26px] border-[#ff6b76] border-l-[#792ca2] opacity-90" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[2rem] bg-[#f4f2fb] p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#792ca2]">Choose a format</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Publishing lanes</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-[var(--slot4-muted-text)]">Select the content type first, then fill in the release details on the right.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`group rounded-[1.5rem] border p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 ${active ? 'border-[#792ca2] bg-[var(--slot4-dark-bg)] text-white shadow-[0_18px_40px_rgba(7,11,34,.18)]' : 'border-black/10 bg-white hover:border-[#792ca2]/35'}`}>
                      <div className="flex items-start gap-3">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${active ? 'bg-white text-[#090e24]' : 'bg-[#f4f2fb] text-[#792ca2] group-hover:bg-[#ffdce7]'}`}><Icon className="h-5 w-5" /></span>
                        <span>
                          <span className="block text-sm font-black">{item.label}</span>
                          <span className={`mt-1 block text-xs font-semibold leading-5 ${active ? 'text-white/65' : 'text-[var(--slot4-muted-text)]'}`}>{item.description}</span>
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[2rem] border border-black/10 bg-[#f8f7ff] p-5 shadow-[0_24px_70px_rgba(7,11,34,.09)] sm:p-7 lg:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#792ca2]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-1 text-3xl font-black tracking-[-0.06em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#792ca2] shadow-sm">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm">
                  <p className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-5 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_35px_rgba(7,11,34,.2)] transition duration-300 hover:-translate-y-1 hover:bg-[#792ca2]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
