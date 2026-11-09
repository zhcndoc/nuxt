<script setup lang="ts">
import type { DropdownMenuItem, TabsItem } from '@nuxt/ui'
import type { BlogPost } from '~/composables/useBlog'

definePageMeta({
  heroBackground: false
})

const title = '动态'
const description = '及时了解 Nuxt 及其官方模块的最新进展。'
const site = useSiteConfig()

useSeoMeta({
  titleTemplate: '%s · Nuxt',
  title,
  description,
  ogTitle: `${title} · Nuxt`,
  ogDescription: description
})
useCanonical('/raw/updates.md')
useHead({
  link: [
    { rel: 'alternate', type: 'application/atom+xml', title: 'Nuxt 博客 RSS', href: `${site.url}/blog/rss.xml` },
    { rel: 'alternate', type: 'application/atom+xml', title: 'Nuxt 更新日志 RSS', href: `${site.url}/changelog/rss.xml` }
  ]
})
defineOgImage('Docs.takumi', {
  headline: '动态',
  title: `Nuxt ${title}`,
  description
})

const route = useRoute()
const router = useRouter()

const category = computed({
  get: () => BLOG_CATEGORIES.find(item => item.slug === route.query.category)?.slug ?? 'all',
  set: (value: string) => router.replace({ query: { ...route.query, category: value === 'all' ? undefined : value, page: undefined } })
})

const routeQuery = computed(() => typeof route.query.q === 'string' ? route.query.q : '')
const search = ref(routeQuery.value)
const query = computed(() => search.value.trim())
watch(routeQuery, (value) => {
  if (value !== query.value) search.value = value
})
watchDebounced(query, (value) => {
  if (value !== routeQuery.value) router.replace({ query: { ...route.query, q: value || undefined, page: undefined } })
}, { debounce: 250 })

const searchInput = useTemplateRef('searchInput')
defineShortcuts({
  '/': () => searchInput.value?.inputRef?.focus()
})

const { posts, timeline, ready } = useUpdates()
await ready

const tabs: TabsItem[] = [
  { label: '全部', value: 'all' },
  ...BLOG_CATEGORIES.map(({ slug, label }) => ({ label, value: slug }))
]

const feeds: DropdownMenuItem[] = [
  { label: '博客 RSS', icon: 'i-lucide-rss', to: '/blog/rss.xml', external: true, target: '_blank' },
  { label: '更新日志 RSS', icon: 'i-lucide-rss', to: '/changelog/rss.xml', external: true, target: '_blank' }
]

const selectedCategory = computed(() => BLOG_CATEGORIES.find(item => item.slug === category.value)?.value)
const inCategory = (post: BlogPost) => !selectedCategory.value || post.category === selectedCategory.value

const articles = computed(() => {
  const regexp = searchTextRegExp(query.value)
  return posts.value.filter(post => inCategory(post) && (regexp.test(post.title) || regexp.test(post.description)))
})

const PAGE_SIZE = 12
const page = computed(() => Math.max(1, Number.parseInt(String(route.query.page), 10) || 1))
const limit = computed(() => page.value * PAGE_SIZE)
</script>

<template>
  <UContainer>
    <UPageHeader
      :title="title"
      :description="description"
      :ui="{
        root: 'border-none pt-12 pb-10 sm:pt-16',
        container: 'sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-8',
        wrapper: 'sm:contents',
        links: 'sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:self-end',
        description: 'max-w-xl'
      }"
    >
      <template #links>
        <div class="flex w-full flex-col gap-1.5 sm:w-72 sm:items-end">
          <p class="text-xs text-muted">
            获取最新版本动态和更新通知。
          </p>
          <NewsletterForm label="" description="" size="sm" class="w-full" />
        </div>
      </template>
    </UPageHeader>

    <UPageBody class="mt-0 flex flex-col gap-20 space-y-0">
      <UpdatesTimeline v-if="timeline.length" :items="timeline" />

      <section aria-labelledby="articles-heading" class="flex flex-col gap-10">
        <div class="flex flex-col gap-4">
          <h2 id="articles-heading" class="text-2xl text-highlighted">
            文章
          </h2>
          <!-- The default underline sits 1px below the list, which would make the scrollable list scroll vertically too. -->
          <UTabs
            v-model="category"
            :items="tabs"
            :content="false"
            variant="link"
            color="neutral"
            :ui="{
              list: 'overflow-x-auto overflow-y-hidden border-b-0 shadow-[inset_0_-1px_0_var(--ui-border)]',
              indicator: 'bottom-0',
              trigger: 'shrink-0'
            }"
          >
            <template #list-trailing>
              <div class="ms-auto hidden items-center gap-1 pb-1.5 sm:flex">
                <UInput
                  ref="searchInput"
                  v-model="search"
                  icon="i-lucide-search"
                  placeholder="搜索文章……"
                  size="sm"
                  class="w-72"
                  aria-label="搜索文章"
                >
                  <template #trailing>
                    <UButton
                      v-if="search"
                      icon="i-lucide-x"
                      aria-label="清除搜索"
                      color="neutral"
                      variant="link"
                      size="xs"
                      class="-me-1"
                      @click="search = ''"
                    />
                    <UKbd v-else value="/" />
                  </template>
                </UInput>
                <UDropdownMenu :items="feeds" :content="{ align: 'end' }">
                  <UButton icon="i-lucide-rss" aria-label="RSS 订阅源" color="neutral" variant="ghost" size="sm" />
                </UDropdownMenu>
              </div>
            </template>
          </UTabs>

          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="搜索文章……"
            class="sm:hidden"
            aria-label="搜索文章"
          />
        </div>

        <UBlogPosts v-if="articles.length" class="gap-y-12 lg:gap-y-14">
          <BlogPostCard
            v-for="(post, index) in articles.slice(0, limit)"
            :key="post.path"
            :post="post"
            :eager="index < 3"
          />
        </UBlogPosts>

        <UEmpty
          v-else-if="query"
          icon="i-lucide-search-x"
          :title="`没有符合“${query}”的文章`"
          :actions="[{ label: '清除搜索', color: 'neutral', variant: 'subtle', onClick: () => { search = '' } }]"
        />

        <UButton
          v-if="articles.length > limit"
          label="显示更多"
          color="neutral"
          variant="subtle"
          :to="{ query: { ...route.query, page: page + 1 } }"
          rel="next"
          class="self-center"
        />
      </section>
    </UPageBody>
  </UContainer>
</template>
