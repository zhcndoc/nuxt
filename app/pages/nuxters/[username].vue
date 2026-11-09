<script setup lang="ts">
import type { Module, Nuxter, NuxterLocaleTranslations, NuxterPeriodStats, NuxterProfilePage, NuxterTranslations, NuxtersPeriod } from '#shared/types'
import { isNuxtersPeriod, nuxterForPeriod, nuxterGithubSearchUrl, nuxterHackathons, nuxtersPeriodPhrase } from '#shared/utils/nuxters'
import { countryName } from '#shared/utils/nuxters-countries'
import { L10N_STRINGS, localisePath } from '#shared/utils/l10n'

definePageMeta({
  heroBackground: 'opacity-30 -z-10'
})

const route = useRoute()
const param = String(route.params.username)

// The profile has every period: switching period needs no request.
const { data: nuxter } = await useFetch<NuxterProfilePage>(`/api/nuxters/${param}`, {
  key: `nuxter-${param.toLowerCase()}`
})

if (!nuxter.value) {
  throw createError({ statusCode: 404, statusMessage: '未找到 Nuxter', fatal: true })
}

// One URL per profile: /nuxters/Atinux → /nuxters/atinux
if (param !== nuxter.value.username) {
  await navigateTo({ path: `/nuxters/${nuxter.value.username}`, query: route.query }, { redirectCode: 301, replace: true })
}

const { format } = new Intl.NumberFormat('en-US')
// By GitHub id: still the owner after a username change.
const { user } = useUserSession()
const isOwner = computed(() => !!user.value && user.value.providerId === String(nuxter.value?.githubId))
const username = nuxter.value.username
const hackathons = computed(() => nuxterHackathons(nuxter.value?.githubId))

// Links set on the GitHub profile, collected nightly by nuxt/nuxters.
const socialIcons: Record<string, string> = {
  twitter: 'i-simple-icons-x',
  bluesky: 'i-simple-icons-bluesky',
  linkedin: 'i-simple-icons-linkedin',
  mastodon: 'i-simple-icons-mastodon',
  youtube: 'i-simple-icons-youtube',
  twitch: 'i-simple-icons-twitch',
  instagram: 'i-simple-icons-instagram',
  facebook: 'i-simple-icons-facebook',
  threads: 'i-simple-icons-threads',
  reddit: 'i-simple-icons-reddit',
  npm: 'i-simple-icons-npm'
}
const displayName = computed(() => nuxter.value?.links?.name || nuxter.value.username)
const links = computed(() => {
  const username = nuxter.value!.username
  const profile = nuxter.value?.links
  const rel = 'me nofollow noopener noreferrer'
  const all = [
    { url: `https://github.com/${username}`, label: `github.com/${username}`, icon: 'i-simple-icons-github', rel: 'me noopener' },
    ...(profile?.website ? [{ url: profile.website, label: '网站', icon: 'i-lucide-globe', rel }] : []),
    ...(profile?.socialAccounts ?? []).map(account => ({
      url: account.url,
      label: account.displayName,
      icon: socialIcons[account.provider] ?? 'i-lucide-link',
      rel
    }))
  ]
  // A website can also be a social account: one icon per URL, the first wins.
  return all.filter((link, index) => all.findIndex(other => other.url === link.url) === index)
})

const since = computed(() => {
  const date = nuxter.value?.firstContributionAt
  return date ? new Intl.DateTimeFormat('zh-CN', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date)) : null
})

// `?period=`: all time by default, or any period the user contributed in.
const available = computed<NuxtersPeriod[]>(() => ['all', ...(nuxter.value?.periods ?? []).map(row => row.period)])
const period = computed<NuxtersPeriod>(() => {
  const requested = route.query.period
  return isNuxtersPeriod(requested) && available.value.includes(requested) ? requested : 'all'
})
const current = computed<Nuxter>(() => nuxterForPeriod(nuxter.value!, period.value) ?? nuxter.value!)
const rankOf = (value: NuxtersPeriod) => nuxterForPeriod(nuxter.value!, value)?.rank

/** Profile links keep the default period out of the URL. */
const periodQuery = (value: NuxtersPeriod) => ({ ...route.query, period: value === 'all' ? undefined : value })

const periodPhrase = nuxtersPeriodPhrase

const yearly = computed(() => (nuxter.value?.periods ?? []).filter(row => /^\d{4}$/.test(row.period)))
// Maintainers get full cards, as on /modules; contributions are compact links (150+ for some).
const maintained = computed(() => nuxter.value?.modules.maintained ?? [])
const contributed = computed(() => nuxter.value?.modules.contributed ?? [])
const blogPosts = computed(() => nuxter.value?.blogPosts ?? [])
const translationLocales = computed(() => nuxter.value?.translationLocales ?? [])
const translator = computed(() => translationLocales.value.filter(locale => locale.edited + locale.verified > 0).map(locale => locale.locale))
const segments = (translations?: NuxterTranslations) => translations ? translations.edited + translations.verified + translations.rejected : 0
// On every period of a translator, so switching period keeps the layout.
const showTranslations = computed(() => translationLocales.value.length > 0 || segments(nuxter.value!.translations) > 0)
const translationSummary = (locale: NuxterLocaleTranslations) => [
  ...(['edited', 'verified', 'rejected'] as const).filter(action => locale[action] > 0).map(action => `${format(locale[action])} ${{ edited: '已编辑', verified: '已校验', rejected: '已拒绝' }[action]}`),
  `${format(locale.words)} 词`
].join(' · ')
// Long lists show their first rows, "Show all" expands them.
function usePreview<T>(items: Ref<T[]>, size: number) {
  const expanded = ref(false)
  const visible = computed(() => expanded.value ? items.value : items.value.slice(0, size))
  const more = computed(() => items.value.length > size)
  return reactive({ expanded, visible, more })
}
const maintainedPreview = usePreview(maintained, 8)
const blogPostsPreview = usePreview(blogPosts, 12)
const contributedPreview = usePreview(contributed, 12)

// Best rank; on a tie (#1 several years), the year with the most points.
const best = computed(() => yearly.value.reduce<typeof yearly.value[number] | undefined>((top, row) =>
  !top || row.rank < top.rank || (row.rank === top.rank && row.score > top.score) ? row : top, undefined))

// One look per contribution type, for the stat cards and the year rows.
// Same colors as the README card (OgImage/Nuxter.takumi.vue). Darker text in light mode, for contrast.
const METRICS = {
  // `hover` keeps the tint of the cards linked to GitHub, instead of the neutral hover of `UPageCard`.
  mergedPullRequests: { one: '已合并 PR', many: '已合并 PR', icon: 'i-lucide-git-merge', tint: 'ring-primary bg-primary/5', hover: 'hover:ring-primary hover:bg-primary/10', text: 'text-primary' },
  issues: { one: 'Issue', many: 'Issue', icon: 'i-lucide-circle-dot', tint: 'ring-sky-400 bg-sky-400/5', hover: 'hover:ring-sky-400 hover:bg-sky-400/10', text: 'text-sky-600 dark:text-sky-400' },
  comments: { one: '评论', many: '评论', icon: 'i-lucide-message-circle', tint: 'ring-violet-400 bg-violet-400/5', hover: 'hover:ring-violet-400 hover:bg-violet-400/10', text: 'text-violet-600 dark:text-violet-400' },
  reactions: { one: '回应', many: '回应', icon: 'i-lucide-smile-plus', tint: 'ring-yellow-400 bg-yellow-400/5', text: 'text-amber-600 dark:text-yellow-400' }
} as const
type Metric = keyof typeof METRICS

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const metricLabel = (metric: Metric, value: number) => value === 1 ? METRICS[metric].one : METRICS[metric].many
const metricValue = (stats: Nuxter | NuxterPeriodStats, metric: Metric) => metric === 'mergedPullRequests' ? stats.mergedPullRequests.all : stats[metric]

interface StatCard {
  icon: string
  tint: string
  text: string
  label: string
  value: number
  detail: string
  class: string
  link?: { url: string, external: boolean, hover?: string, label: string }
}

// The day of the server render, in the payload: the page is cached for an hour and must hydrate with the same links.
const today = useState('nuxters-today', () => new Date().toISOString().slice(0, 10))
const stats = computed(() => {
  const n = current.value
  const details: Record<Metric, string> = {
    mergedPullRequests: `${format(n.mergedPullRequests.feat)} 功能 · ${format(n.mergedPullRequests.fix)} 修复 · ${format(n.mergedPullRequests.docs)} 文档 · ${format(n.mergedPullRequests.chore)} 维护`,
    issues: `${format(n.helpfulIssues)} 个有帮助`,
    comments: `${format(n.helpfulComments)} 条有帮助`,
    reactions: '收到的回应'
  }
  const cards: StatCard[] = (Object.keys(METRICS) as Metric[]).map(metric => ({
    ...METRICS[metric],
    label: capitalize(metricLabel(metric, metricValue(n, metric))),
    value: metricValue(n, metric),
    detail: details[metric],
    class: '',
    // Reactions are received: GitHub cannot search them.
    link: metric === 'reactions'
      ? undefined
      : {
          url: nuxterGithubSearchUrl(username, metric, period.value, new Date(today.value)),
          external: true,
          hover: METRICS[metric].hover,
          // The link covers the card: its name also says the count.
          label: metric === 'comments'
            ? `${format(n.comments)} 条${periodPhrase(period.value)}评论：${username} 在 GitHub 上评论过的 Issue 和 PR`
            : `${format(metricValue(n, metric))} ${metricLabel(metric, metricValue(n, metric))}：${username} 在 GitHub 上${periodPhrase(period.value)}的贡献`
        }
  }))
  if (!showTranslations.value) return cards

  const translations = n.translations ?? { edited: 0, verified: 0, rejected: 0 }
  const total = segments(translations)
  const label = '翻译片段'
  // Three cards on the first row, two wider ones on the second; translations last on mobile.
  cards.forEach((card, index) => {
    card.class = index < 2 ? 'sm:col-span-2' : 'sm:col-span-3'
  })
  cards.splice(2, 0, {
    icon: 'i-lucide-languages',
    tint: 'ring-rose-400 bg-rose-400/5',
    text: 'text-rose-600 dark:text-rose-400',
    label: capitalize(label),
    value: total,
    detail: (['edited', 'verified', 'rejected'] as const).map(action => `${format(translations[action])} ${{ edited: '已编辑', verified: '已校验', rejected: '已拒绝' }[action]}`).join(' · '),
    class: 'col-span-2 order-last sm:order-none',
    link: {
      url: '/translations',
      external: false,
      hover: 'hover:ring-rose-400 hover:bg-rose-400/10',
      label: `${username} 在${periodPhrase(period.value)}${format(total)} 个${label}，查看翻译页面`
    }
  })
  return cards
})

// Shared links show the period on screen: title, description, `og:url` and card.
// The canonical URL has no `?period=`, so search engines see one page per profile.
const site = useSiteConfig()
const shareUrl = computed(() => `${site.url}/nuxters/${username}${period.value === 'all' ? '' : `?period=${period.value}`}`)
const title = computed(() => period.value === 'all'
  ? `${username} 的 Nuxter 个人资料`
  : `${username}：Nuxter 第 ${format(current.value.rank)} 名（${periodPhrase(period.value)}）`)
const description = computed(() => {
  const n = current.value
  if (period.value === 'all') {
    return `查看 ${username} 对 Nuxt 生态的贡献：排名第 ${format(n.rank)}，获得 ${format(n.score)} 分。`
  }
  const made = (['mergedPullRequests', 'issues', 'comments'] as const)
    .map(metric => `${format(metricValue(n, metric))} ${metricLabel(metric, metricValue(n, metric))}`)
  return `${username} 在${periodPhrase(period.value)}为 Nuxt 生态做出 ${made.join('、')}贡献：排名第 ${format(n.rank)}，获得 ${format(n.score)} 分。`
})
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: shareUrl
})
useCanonical()
// No `period` for all time: its image URL stays the same as before periods existed.
defineOgImage('Nuxter.takumi', { username, period: () => period.value === 'all' ? undefined : period.value }, {
  // Stats change once a day
  cacheMaxAgeSeconds: 60 * 60
})
</script>

<template>
  <UPage v-if="nuxter">
    <UContainer class="pt-8">
      <!-- Back to the leaderboard of the period on screen -->
      <UButton
        :to="{ path: '/nuxters', query: { period } }"
        label="所有 Nuxters"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="link"
        class="px-0"
      />
    </UContainer>

    <!-- Profile on the left, stats on the right; stacked below lg -->
    <UContainer class="py-8 lg:py-20 scroll-mt-16">
      <!-- Stats get more room: 2/5 + 3/5 on lg, 1/3 + 2/3 from xl -->
      <div class="grid lg:grid-cols-5 xl:grid-cols-3 gap-8 lg:gap-12 items-center">
        <!-- Below lg: avatar next to the name, everything left-aligned and compact -->
        <div class="flex flex-col items-start gap-4 lg:gap-6 lg:col-span-2 xl:col-span-1 min-w-0">
          <div class="flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-6">
            <!-- Square, like the leaderboard avatars -->
            <NuxtImg
              :src="`/gh_avatar/${nuxter.username}`"
              provider="ipx"
              densities="x1 x2"
              width="112"
              height="112"
              format="auto"
              :alt="nuxter.username"
              class="size-20 lg:size-28 shrink-0 rounded-xl ring ring-default bg-muted"
            />

            <div class="flex flex-col gap-1 lg:gap-2 min-w-0">
              <!-- Usernames go up to 39 characters: smaller title for long ones, full name on hover -->
              <h1
                class="text-3xl sm:text-4xl font-bold text-highlighted truncate lg:leading-14"
                :title="displayName"
              >
                {{ displayName }}
              </h1>
              <p class="text-lg text-toned truncate -mt-1 lg:-mt-2">
                {{ nuxter.username }}
              </p>
              <!-- GitHub first, then the links set on it: those are never followed by crawlers, `me` for Mastodon verification -->
              <ul class="flex flex-wrap items-center gap-0.5 -ml-1.5" aria-label="个人主页链接">
                <li v-for="link in links" :key="link.url">
                  <UTooltip :text="link.label">
                    <UButton
                      :to="link.url"
                      target="_blank"
                      :rel="link.rel"
                      :icon="link.icon"
                      :aria-label="link.label"
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      class="text-muted hover:text-highlighted"
                    />
                  </UTooltip>
                </li>
              </ul>
            </div>
          </div>

          <div class="flex flex-col gap-1 lg:gap-3">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 lg:text-lg">
              <span class="tabular-nums">
                <template v-if="period === 'all'">Nuxter 第 {{ format(current.rank) }} 名</template>
                <template v-else>#{{ format(current.rank) }} {{ periodPhrase(period) }}</template>
              </span>
              <span class="text-dimmed">·</span>
              <span class="flex items-center gap-1">
                <span class="font-semibold text-highlighted tabular-nums">{{ format(current.score) }}</span> 分
                <NuxtersScoreBreakdown :nuxter="current" />
              </span>
            </div>
            <p v-if="nuxter.country || since || best" class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm lg:text-base text-muted">
              <!-- The leaderboard of the same country and period. `nofollow`: crawlers would render every country × period. -->
              <NuxtLink v-if="nuxter.country" :to="{ path: '/nuxters', query: { period, country: nuxter.country }, hash: '#leaderboard' }" rel="nofollow" class="inline-flex items-center gap-1.5 hover:text-highlighted transition-colors">
                <UIcon name="i-lucide-map-pin" class="size-4" />
                {{ countryName(nuxter.country) }}
              </NuxtLink>
              <span v-if="since" class="inline-flex items-center gap-1.5">
                <UIcon name="i-lucide-calendar" class="size-4" />
                从 {{ since }} 开始贡献
              </span>
              <!-- Opens that year -->
              <NuxtLink v-if="best" :to="{ query: periodQuery(best.period) }" class="inline-flex items-center gap-1.5 hover:text-highlighted transition-colors tabular-nums">
                <UIcon name="i-lucide-award" class="size-4" />
                表现最佳年份：{{ best.period }} 年，第 {{ format(best.rank) }} 名，{{ format(best.score) }} 分
              </NuxtLink>
            </p>
          </div>

          <div v-if="hackathons.length || maintained.length || translator.length" class="flex flex-wrap gap-2">
            <UBadge
              v-for="hackathon in hackathons"
              :key="hackathon.id"
              :label="hackathon.name"
              icon="i-lucide-trophy"
              variant="subtle"
              class="lg:text-sm"
            />
            <UBadge
              v-if="maintained.length"
              label="模块作者"
              icon="i-lucide-puzzle"
              color="neutral"
              variant="subtle"
              class="lg:text-sm"
            />
            <UBadge
              v-if="translator.length"
              :label="`翻译贡献者（${translator.join('、')}）`"
              icon="i-lucide-languages"
              color="neutral"
              variant="subtle"
              class="lg:text-sm"
            />
          </div>

          <!-- Only for the owner: the page is cached for everyone, so the session is checked in the browser.
               Sharing is a desktop action (copying Markdown into a GitHub README).
               An empty fallback: the default `<span>` would take a gap of the column until hydration. -->
          <ClientOnly>
            <div v-if="isOwner" class="hidden lg:block">
              <NuxtersShare :username="nuxter.username" :period="period" :periods="available" />
            </div>
            <template #fallback />
          </ClientOnly>
        </div>

        <div class="flex flex-col gap-4 lg:col-span-3 xl:col-span-2">
          <div class="flex flex-wrap items-center lg:justify-end gap-3">
            <NuxtersPeriodTabs
              :period="period"
              :periods="available"
              :to="value => ({ query: periodQuery(value) })"
              :rank="rankOf"
              aria-label="个人资料统计周期"
            />
          </div>

          <ul class="grid grid-cols-2 gap-4" :class="showTranslations && 'sm:grid-cols-6'" :aria-label="`${periodPhrase(period)}的贡献`">
            <li v-for="stat in stats" :key="stat.icon" :class="stat.class">
              <UPageCard
                :icon="stat.icon"
                variant="subtle"
                :to="stat.link?.url"
                :target="stat.link?.external ? '_blank' : undefined"
                :aria-label="stat.link?.label"
                :class="['h-full group', stat.tint, stat.link?.hover]"
                :ui="{ leadingIcon: stat.text }"
              >
                <UIcon
                  v-if="stat.link"
                  :name="stat.link.external ? 'i-lucide-arrow-up-right' : 'i-lucide-arrow-right'"
                  class="absolute top-4 right-4 sm:top-6 sm:right-6 size-5 text-muted group-hover:text-highlighted transition-colors"
                />
                <div class="flex flex-col gap-1">
                  <span class="text-3xl sm:text-4xl font-semibold text-highlighted tabular-nums">{{ format(stat.value) }}</span>
                  <span :class="stat.text">{{ stat.label }}</span>
                  <span class="text-sm text-muted">{{ stat.detail }}</span>
                </div>
              </UPageCard>
            </li>
          </ul>
        </div>
      </div>
    </UContainer>

    <UPageBody class="mt-0">
      <UContainer>
        <div class="flex flex-col gap-12">
          <section v-if="maintained.length" aria-labelledby="maintained-modules">
            <h2 id="maintained-modules" class="text-2xl font-bold text-highlighted mb-1">
              维护的模块
            </h2>
            <p class="text-muted mb-6">
              维护了 Nuxt 生态中的 {{ maintained.length }} 个模块。
            </p>
            <UPageGrid class="lg:grid-cols-2 xl:grid-cols-4 gap-4">
              <!-- The card shape of /modules: the missing fields are only read by the project tools, off here -->
              <ModuleItem
                v-for="module in maintainedPreview.visible"
                :key="module.name"
                :module="module as Module"
                :is-added="false"
                :show-add-button="false"
                :show-badge="false"
              />
            </UPageGrid>
            <UButton
              v-if="maintainedPreview.more"
              :label="maintainedPreview.expanded ? '收起' : `显示全部 ${maintained.length} 个`"
              :trailing-icon="maintainedPreview.expanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              color="neutral"
              variant="ghost"
              class="mt-4"
              @click="maintainedPreview.expanded = !maintainedPreview.expanded"
            />
          </section>

          <section v-if="contributed.length" aria-labelledby="contributed-modules">
            <h2 id="contributed-modules" class="text-2xl font-bold text-highlighted mb-1">
              参与贡献
            </h2>
            <p class="text-muted mb-6">
              在 {{ contributed.length }} 个模块中的提交{{ maintained.length ? '（由其他成员维护）' : '' }}，按下载量排序。
            </p>
            <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <li v-for="module in contributedPreview.visible" :key="module.name">
                <NuxtLink
                  :to="`/modules/${module.name}`"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 ring ring-default hover:bg-elevated/50 transition-colors"
                >
                  <UAvatar
                    :src="moduleImage(module.icon)"
                    :icon="moduleIcon(module.category)"
                    :alt="module.name"
                    size="sm"
                    class="rounded-md bg-transparent"
                  />
                  <span class="min-w-0">
                    <span class="block font-medium text-sm text-highlighted truncate">{{ module.name }}</span>
                    <span class="block text-xs text-muted truncate">{{ module.npm }}</span>
                  </span>
                </NuxtLink>
              </li>
            </ul>
            <UButton
              v-if="contributedPreview.more"
              :label="contributedPreview.expanded ? '收起' : `显示全部 ${contributed.length} 个`"
              :trailing-icon="contributedPreview.expanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              color="neutral"
              variant="ghost"
              class="mt-4"
              @click="contributedPreview.expanded = !contributedPreview.expanded"
            />
          </section>

          <section v-if="blogPosts.length" aria-labelledby="blog-posts">
            <h2 id="blog-posts" class="text-2xl font-bold text-highlighted mb-1">
              博客文章
            </h2>
            <p class="text-muted mb-6">
              Nuxt 博客中的 {{ blogPosts.length }} 篇文章。
            </p>
            <!-- The rows of contributed modules: 30+ full cards for some -->
            <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <li v-for="post in blogPostsPreview.visible" :key="post.path">
                <NuxtLink
                  :to="post.path"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 ring ring-default hover:bg-elevated/50 transition-colors"
                >
                  <NuxtImg
                    v-if="post.image"
                    :src="post.image"
                    width="57"
                    height="32"
                    densities="x1 x2"
                    :alt="`${post.title} 配图`"
                    loading="lazy"
                    class="h-8 aspect-video shrink-0 rounded-md object-cover"
                  />
                  <span class="min-w-0">
                    <span class="block font-medium text-sm text-highlighted truncate">{{ post.title }}</span>
                    <span class="block text-xs text-muted truncate">{{ formatDateByLocale('zh-CN', post.date) }}</span>
                  </span>
                </NuxtLink>
              </li>
            </ul>
            <UButton
              v-if="blogPostsPreview.more"
              :label="blogPostsPreview.expanded ? '收起' : `显示全部 ${blogPosts.length} 篇`"
              :trailing-icon="blogPostsPreview.expanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              color="neutral"
              variant="ghost"
              class="mt-4"
              @click="blogPostsPreview.expanded = !blogPostsPreview.expanded"
            />
          </section>

          <section v-if="translationLocales.length" aria-labelledby="translations">
            <h2 id="translations" class="text-2xl font-bold text-highlighted mb-1">
              翻译贡献
            </h2>
            <p class="text-muted mb-6">
              {{ nuxter.username }} 在 <ULink to="/translations" class="text-highlighted hover:underline">Nuxt 当前文档翻译</ULink>中编辑、校验或拒绝的片段。
            </p>
            <!-- Localised docs are served under their own base: a full page load -->
            <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <li v-for="locale in translationLocales" :key="locale.locale">
                <ULink
                  :to="localisePath(locale.locale, '/docs')"
                  external
                  class="flex items-center gap-3 rounded-lg px-3 py-2 ring ring-default hover:bg-elevated/50 transition-colors"
                >
                  <span class="flex items-center justify-center size-8 shrink-0 rounded-md bg-elevated font-mono text-xs uppercase text-highlighted">{{ locale.locale }}</span>
                  <span class="min-w-0">
                    <span class="block font-medium text-sm text-highlighted truncate" :lang="locale.locale">{{ L10N_STRINGS[locale.locale].language }}</span>
                    <span class="block text-xs text-muted truncate tabular-nums">{{ translationSummary(locale) }}</span>
                  </span>
                </ULink>
              </li>
            </ul>
          </section>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
