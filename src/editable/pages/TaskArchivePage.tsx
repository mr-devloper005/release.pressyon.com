import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, Newspaper, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  mediaDistribution: { icon: Newspaper, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Newswire cards prioritize source, category, headline, and publication-ready summaries.', badge: 'News' },
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Readable editorial cards with room for headlines and excerpts.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards highlight company identity, location, contacts, and service details.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer-board cards prioritize price, location, condition, and quick action.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Gallery-first browsing with strong visuals and compact captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Bookmark cards stay mostly text-based so saved resources scan quickly.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context, download intent, and summary.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards focus on identity, short bio, and direct discovery.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = { '--archive-bg': preset.colors.background, '--archive-text': preset.colors.foreground, '--archive-surface': preset.colors.surface, '--archive-accent': preset.colors.accent } as CSSProperties
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getCategory(post, '')
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category

  if (task === 'mediaDistribution' || task === 'article') {
    return (
      <EditorialArchive
        posts={posts}
        pagination={pagination}
        category={category}
        categoryLabel={categoryLabel}
        categories={dynamicCategories}
        basePath={basePath}
        label={label}
      />
    )
  }

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="rounded-[2.5rem] border border-[var(--editable-border)] bg-[var(--archive-surface)] p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]"><Icon className="h-4 w-4" /> {label}</div>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 opacity-70">{voice?.description || SITE_CONFIG.description}</p>
            <div className="mt-6 rounded-[1.5rem] border border-[var(--editable-border)] bg-white/55 p-4 text-sm font-bold leading-7 opacity-75">{deck.promise}</div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={basePath} className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">Browse all</Link>
              <Link href="/search" className="rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-black">Search posts</Link>
            </div>
          </div>

          <form action={basePath} className="self-end rounded-[2rem] border border-[var(--editable-border)] bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-55"><Filter className="h-4 w-4" /> Filter</div>
            <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-2xl border border-[var(--editable-border)] bg-white px-4 text-sm font-bold outline-none">
              <option value="all">All categories</option>
              {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="mt-3 h-12 w-full rounded-2xl bg-[var(--archive-text)] text-sm font-black text-[var(--archive-bg)]">Apply</button>
            <p className="mt-3 text-xs font-bold opacity-55">Showing: {categoryLabel}</p>
          </form>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--editable-border)] bg-white/60 p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm opacity-65">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
            <span className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchive({
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
}) {
  const page = pagination.page || 1
  const lead = posts[0]
  const secondary = posts.slice(1, 4)
  const remaining = posts.slice(4)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
        <section className="overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <div className="relative mx-auto grid max-w-[1320px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_8%,rgba(224,84,84,.45),transparent_28rem),linear-gradient(130deg,#090e24,#171342_50%,#4f2242)]" />
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-white/60">{category === 'all' ? 'Media distribution' : categoryLabel}</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Browse <span className="editorial-serif italic">{category === 'all' ? label : categoryLabel}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-white/75">A polished release library with strong visuals, quick filtering, and editorial-style reading paths.</p>
              <form action={basePath} className="mt-8 flex max-w-xl overflow-hidden rounded-full bg-white">
                <select name="category" defaultValue={category} className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm font-black text-[#090e24] outline-none">
                  <option value="all">All categories</option>
                  {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="bg-[#792ca2] px-6 text-sm font-black text-white">Filter</button>
              </form>
            </div>
            <div className="relative z-10 hidden min-h-[420px] lg:block">
              <div className="absolute right-6 top-0 h-96 w-72 rotate-[7deg] rounded-[2.2rem] border-[10px] border-[#2e3340] bg-white p-5 shadow-2xl">
                <div className="mx-auto h-5 w-28 rounded-full bg-[#111]" />
                <div className="mt-8 space-y-4">
                  {(lead ? [lead, ...secondary] : secondary).slice(0, 3).map((post) => (
                    <div key={post.id || post.slug} className="overflow-hidden rounded-xl border border-black/10">
                      <img src={getImage(post)} alt="" className="aspect-[16/8] w-full object-cover" />
                      <p className="p-3 text-xs font-black leading-tight text-[#090e24]">{post.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute right-64 top-20 h-72 w-72 rounded-full border-[28px] border-[#ff6b76] border-l-[#792ca2]" />
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white">
          <div className="mx-auto flex max-w-[1320px] gap-3 overflow-x-auto px-4 py-5 text-sm font-black sm:px-6 lg:px-8">
            <Link href={basePath} className={category === 'all' ? 'rounded-full bg-[#090e24] px-5 py-2.5 text-white' : 'rounded-full bg-[#f2f0fb] px-5 py-2.5 hover:bg-[#ffdce7]'}>Latest</Link>
            {categories.slice(0, 8).map((item) => (
              <Link key={item.slug} href={pageHref(basePath, item.slug, 1)} className={category === item.slug ? 'whitespace-nowrap rounded-full bg-[#090e24] px-5 py-2.5 text-white' : 'whitespace-nowrap rounded-full bg-[#f2f0fb] px-5 py-2.5 hover:bg-[#ffdce7]'}>
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        {lead ? (
          <section className="mx-auto grid max-w-[1320px] gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.55fr_.8fr] lg:px-8 lg:py-16">
            <Link href={`${basePath}/${lead.slug}`} className="group relative min-h-[34rem] overflow-hidden rounded-[2rem] bg-[var(--slot4-dark-bg)] text-white shadow-[0_24px_60px_rgba(7,11,34,.18)]">
              <img src={getImage(lead)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090e24] via-[#090e24]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
                <span className="rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#090e24]">{getCategory(lead, label)}</span>
                <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl">{lead.title}</h2>
                <p className="mt-5 max-w-2xl line-clamp-2 text-sm font-semibold leading-7 text-white/80">{getSummary(lead)}</p>
              </div>
            </Link>
            <div className="grid gap-4">
              <div className="rounded-[2rem] bg-[#f2f0fb] p-6">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#792ca2]">Top stories</p>
                <p className="editorial-serif mt-3 text-3xl font-black italic leading-tight">What distributors are reading now.</p>
              </div>
              {secondary.map((post, index) => (
                <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className="group grid grid-cols-[8rem_1fr] overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                  <img src={getImage(post)} alt="" className="h-full min-h-40 w-full object-cover transition group-hover:scale-105" />
                  <div className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#792ca2]">0{index + 1}</p>
                    <h3 className="mt-3 text-xl font-black leading-tight tracking-[-.035em]">{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-[1320px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b-4 border-black pb-4">
            <h2 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">More from the desk</h2>
            <form action={basePath} className="flex overflow-hidden rounded-full border border-black/10 bg-white shadow-sm">
              <select name="category" defaultValue={category} className="h-12 min-w-44 bg-transparent px-4 text-xs font-black uppercase outline-none">
                <option value="all">All categories</option>
                {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="h-12 bg-[#090e24] px-5 text-xs font-black uppercase tracking-[0.14em] text-white">Filter</button>
            </form>
          </div>

          {remaining.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remaining.map((post, index) => (
                <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className={index % 5 === 0 ? 'group overflow-hidden rounded-[2rem] bg-[#090e24] text-white shadow-[0_16px_45px_rgba(7,11,34,.18)] md:col-span-2' : 'group overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1'}>
                  <div className={index % 5 === 0 ? 'aspect-[16/7] overflow-hidden bg-black' : 'aspect-[16/10] overflow-hidden bg-black'}>
                    <img src={getImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className={index % 5 === 0 ? 'flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/60' : 'flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#c13383]'}>
                      <span>{getCategory(post, label)}</span><span>{String(index + 3).padStart(2, '0')}</span>
                    </div>
                    <h3 className={index % 5 === 0 ? 'mt-4 text-4xl font-black leading-[1.05] tracking-[-.05em]' : 'mt-4 text-2xl font-black leading-[1.05] tracking-[-.04em]'}>{post.title}</h3>
                    <p className={index % 5 === 0 ? 'mt-4 line-clamp-3 text-sm leading-6 text-white/65' : 'mt-4 line-clamp-3 text-sm leading-6 text-black/60'}>{getSummary(post)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : !lead ? (
            <div className="rounded-[2rem] border border-dashed border-black/20 bg-[#f4f2fb] p-12 text-center">
              <Search className="mx-auto h-8 w-8" />
              <h2 className="mt-4 text-3xl font-black">No stories found</h2>
              <p className="mt-2 text-sm text-black/60">Try another category or publish a new newsroom story.</p>
            </div>
          ) : null}

          <div className="mt-10 flex items-center justify-center gap-0">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-l-full border border-black/10 bg-white px-5 py-3 text-xs font-black uppercase">Previous</Link> : null}
            <span className="bg-[#090e24] px-5 py-3 text-xs font-black uppercase text-white">Page {page} / {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-r-full border border-black/10 bg-white px-5 py-3 text-xs font-black uppercase">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">{category}</span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--archive-accent)]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 opacity-65">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[var(--editable-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--archive-bg)] ring-1 ring-[var(--editable-border)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--archive-text)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--archive-bg)]">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[var(--editable-border)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 opacity-65">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold opacity-70 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[var(--archive-text)] p-5 text-[var(--archive-bg)]">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold opacity-75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-65">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[var(--archive-text)] hover:text-[var(--archive-bg)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--archive-text)] p-5 text-[var(--archive-bg)]"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-65">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--archive-bg)] ring-1 ring-[var(--editable-border)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 opacity-65">{getSummary(post)}</p>
    </Link>
  )
}
