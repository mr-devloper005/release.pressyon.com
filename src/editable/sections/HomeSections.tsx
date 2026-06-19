import Link from 'next/link'
import { BarChart3, Layers3, Search, Settings, UsersRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { CompactIndexCard, HorizontalPostCard, ImageFirstCard, getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function DeviceFeed({ posts, primaryTask, primaryRoute, compact = false }: { posts: SitePost[]; primaryTask: TaskKey; primaryRoute: string; compact?: boolean }) {
  const feed = posts.slice(0, compact ? 2 : 4)
  return (
    <div className="h-full bg-white px-4 pb-5 pt-12 text-[#0b1028]">
      <div className="mb-5 flex items-center justify-between text-[10px] font-bold text-black/35">
        <span>World</span><span>Trends</span><span>Lifestyle</span><span>Business</span>
      </div>
      <div className="space-y-4">
        {feed.map((post, index) => (
          <Link key={post.id || post.slug || post.title} href={postHref(primaryTask, post, primaryRoute)} className="block overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
            <div className={index === 0 ? 'aspect-[16/8]' : 'aspect-[16/9]'}>
              <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-[9px] font-black uppercase tracking-[.16em] text-[#792ca2]">{getEditableCategory(post)}</p>
              <h3 className="mt-1 line-clamp-2 text-xs font-black leading-tight">{post.title}</h3>
            </div>
          </Link>
        ))}
        {!feed.length ? (
          <div className="rounded-xl border border-dashed border-black/20 p-5 text-center text-xs font-bold text-black/45">Release stories will appear here.</div>
        ) : null}
      </div>
    </div>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const heroTitle = pagesContent.home.hero.title.join(' ') || 'Driving Performance, Elevating Outcomes'

  return (
    <section className="overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
      <div className="relative mx-auto min-h-[620px] max-w-[1320px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(224,84,84,.45),transparent_25rem),linear-gradient(125deg,#090e24_0%,#16133d_45%,#4f2242_100%)]" />
        <div className="absolute right-[-8rem] top-[-10rem] h-[24rem] w-[24rem] rounded-full border-[30px] border-white/80 opacity-70" />
        <div className="relative z-10 grid min-h-[500px] items-center gap-10 lg:grid-cols-[.88fr_1fr]">
          <div>
            <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-[-.055em] sm:text-6xl lg:text-7xl">
              Driving <span className="editorial-serif italic">Performance,</span><br />Elevating <span className="editorial-serif italic">Outcomes</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg font-semibold leading-8 text-white/82">{lead ? getEditableExcerpt(lead, 180) : pagesContent.home.hero.description || heroTitle}</p>
            <Link href={primaryRoute} className="mt-9 inline-flex rounded-full bg-white px-8 py-4 text-base font-black text-[var(--slot4-dark-bg)] transition hover:bg-[#ffdce7]">
              Get Started
            </Link>
          </div>
          <div className="relative min-h-[430px]">
            <div className="press-device absolute right-[18%] top-0 hidden h-[430px] w-[230px] rotate-[-5deg] opacity-70 sm:block">
              <DeviceFeed posts={posts.slice(1)} primaryTask={primaryTask} primaryRoute={primaryRoute} compact />
            </div>
            <div className="press-device absolute right-0 top-28 h-[470px] w-[270px] sm:w-[300px]">
              <DeviceFeed posts={posts} primaryTask={primaryTask} primaryRoute={primaryRoute} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 3)
  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} py-16 text-center`}>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">Plan releases, shape messages, and keep distribution moving with a clean editorial workflow.</p>
        <Link href={primaryRoute} className="mt-8 inline-flex rounded-full bg-[var(--slot4-dark-bg)] px-8 py-4 text-base font-black text-white transition hover:bg-[#792ca2]">Get Started</Link>
        <div className="mx-auto mt-16 h-px max-w-2xl bg-black/15" />
        <h2 className="mt-14 text-3xl font-black leading-tight tracking-[-.04em]">
          Data Never Lies. <span className="editorial-serif italic">Neither Do Our Partners.</span>
        </h2>
        <div className="mx-auto mt-16 grid max-w-4xl gap-10 sm:grid-cols-3">
          {[
            ['ECOFLOW', '+35%', 'Time Spent vs. Social'],
            ['TORRAS', '-90%', 'CPA vs. Social'],
            ['hipto', '-15%', 'CPL vs. Social'],
          ].map(([brand, stat, label]) => (
            <div key={brand} className="text-center">
              <p className="text-2xl font-black tracking-[-.04em] text-[var(--slot4-muted-text)]">{brand}</p>
              <p className="mt-8 text-6xl font-black tracking-[-.06em] text-[var(--slot4-dark-bg)]">{stat}</p>
              <div className="mx-auto mt-5 h-px max-w-48 bg-[linear-gradient(90deg,#792ca2,#e05454)]" />
              <p className="mt-4 text-sm text-[var(--slot4-muted-text)]">{label}</p>
            </div>
          ))}
        </div>
        {railPosts.length ? (
          <div className="mt-20 grid gap-5 text-left md:grid-cols-3">
            {railPosts.map((post, index) => <ImageFirstCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[3] || posts[0]
  return (
    <section className="overflow-hidden bg-[#f2f1fb]">
      <div className={`${dc.shell.section} pt-8`}>
        <div className="relative mx-auto min-h-[560px] max-w-5xl">
          <div className="absolute left-4 top-0 h-80 w-80 rounded-full border-[38px] border-[#ff6b76] border-l-[#792ca2]" />
          <div className="press-device absolute left-1/2 top-20 h-[430px] w-[650px] max-w-[86vw] -translate-x-1/2 rotate-[-14deg] rounded-[1.4rem] border-[14px]">
            <div className="h-full bg-white p-8 pt-12">
              <div className="mb-5 grid grid-cols-5 gap-3 text-[10px] text-black/35"><span>World</span><span>Entertainment</span><span>Lifestyle</span><span>Sports</span><span>Business</span></div>
              {lead ? (
                <Link href={postHref(primaryTask, lead, primaryRoute)} className="grid gap-5 md:grid-cols-[1.2fr_.8fr]">
                  <img src={getEditablePostImage(lead)} alt={lead.title} className="aspect-[16/10] w-full rounded-xl object-cover" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#792ca2]">{getEditableCategory(lead)}</p>
                    <h3 className="mt-3 text-2xl font-black leading-tight">{lead.title}</h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-black/60">{getEditableExcerpt(lead, 180)}</p>
                  </div>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
        <div className="grid gap-10 py-16 lg:grid-cols-[.9fr_1.1fr] lg:py-24">
          <h2 className="text-5xl font-black leading-[1.12] tracking-[-.055em]">
            Nearly Two Decades of Defining <span className="editorial-serif italic">Performance Standards.</span>
          </h2>
          <div>
            <p className="text-lg leading-8 text-[var(--slot4-muted-text)]">For public launches and media updates, a strong presentation matters as much as reach. This experience keeps releases readable, visual, and easy to explore.</p>
            <p className="mt-6 text-lg leading-8 text-[var(--slot4-muted-text)]">The layout blends a campaign landing page with a clean magazine archive, giving every post a better stage.</p>
            <Link href={primaryRoute} className="mt-8 inline-flex rounded-full bg-[var(--slot4-dark-bg)] px-8 py-4 text-base font-black text-white transition hover:bg-[#792ca2]">Read More</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = collected.length ? collected : posts
  const featureCards = source.slice(4, 8)
  const briefs = source.slice(8, 14)
  const icons = [UsersRound, Settings, BarChart3, Layers3]
  const titles = ['Customer-Centricity', 'Agility & Flexibility', 'Data-Driven Results', 'Seamless Integration']

  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} py-16 lg:py-24`}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((post, index) => {
            const Icon = icons[index % icons.length]
            return (
              <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group relative min-h-[380px] overflow-hidden rounded-2xl bg-[var(--slot4-dark-bg)] text-white shadow-[0_12px_30px_rgba(7,11,34,.16)]">
                <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(9,14,36,.92))]" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <Icon className="mb-4 h-9 w-9" />
                  <h3 className="text-xl font-black">{titles[index] || getEditableCategory(post)}</h3>
                  <p className="mt-2 line-clamp-2 text-base leading-6 text-white/82">{getEditableExcerpt(post, 90)}</p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-[.78fr_1.22fr]">
          <div>
            <h2 className="text-5xl font-black leading-[1.05] tracking-[-.055em]">Continuity Meets <span className="editorial-serif italic">Innovation.</span></h2>
            <p className="mt-8 text-2xl font-black">It&apos;s the <span className="editorial-serif italic">same commitment, amplified.</span></p>
          </div>
          <div className="text-lg leading-8 text-[var(--slot4-muted-text)]">
            <p>You know the value of a focused media release. This design keeps that focus while adding stronger hierarchy, richer cards, and routes that make browsing feel intentional.</p>
            <p className="mt-6">Every section is built from existing post data, with fallbacks for missing media, summaries, or categories.</p>
            <Link href={primaryRoute} className="mt-8 inline-flex rounded-full bg-[var(--slot4-dark-bg)] px-8 py-4 text-base font-black text-white transition hover:bg-[#792ca2]">Get Started</Link>
          </div>
        </div>

        {briefs.length ? (
          <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_.8fr]">
            <div className="grid gap-5">
              {briefs.slice(0, 3).map((post, index) => <HorizontalPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
            <aside className="rounded-3xl bg-[#f4f2fb] p-6">
              <div className="border-b border-black/10 pb-4">
                <p className="text-xs font-black uppercase tracking-[.22em] text-[#792ca2]">Quick reads</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-.04em]">The briefing</h2>
              </div>
              {briefs.slice(3, 8).map((post, index) => <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </aside>
          </div>
        ) : null}

        <form action="/search" className="mt-16 grid gap-5 rounded-3xl bg-[var(--slot4-dark-bg)] p-6 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <h3 className="text-3xl font-black tracking-[-.04em]">Search the full archive</h3>
            <p className="mt-2 text-sm text-white/65">Explore every {taskLabel(primaryTask).toLowerCase()} published by {SITE_CONFIG.name}.</p>
          </div>
          <label className="flex overflow-hidden rounded-full bg-white sm:min-w-[420px]">
            <Search className="ml-4 mt-4 h-4 w-4 text-black/45" />
            <input name="q" placeholder="Search stories" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-black outline-none" />
            <button className="bg-[#792ca2] px-5 text-sm font-black text-white">Search</button>
          </label>
        </form>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-white pb-16">
      <div className={`${dc.shell.section}`}>
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#443199,#792ca2_45%,#e05454)] p-8 text-white sm:p-12 lg:p-16">
          <p className="text-sm font-black uppercase tracking-[.2em] text-white/70">Ready for distribution</p>
          <h2 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-.055em]">Give each release a stronger first impression.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-white px-8 py-4 text-base font-black text-[var(--slot4-dark-bg)]">Contact</Link>
            <Link href="/signup" className="rounded-full border border-white/60 px-8 py-4 text-base font-black text-white transition hover:bg-white hover:text-[var(--slot4-dark-bg)]">Get Started</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
