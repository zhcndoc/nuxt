<script setup lang="ts">
import { debounce } from 'perfect-debounce'
import type { ParsedContent } from '@nuxt/content'
import './styles/twoslash.css'

const search = ref(null)
const colorMode = useColorMode()
const { headerLinks, searchGroups, searchLinks } = useNavigation()
const color = computed(() => colorMode.value === 'dark' ? '#020420' : 'white')

const { data: navigation } = await useLazyAsyncData('navigation', () => fetchContentNavigation(), { default: () => [] })
const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', {
  default: () => [],
  server: false
})

useHead({
  titleTemplate: title => title ? `${title} - Nuxt 中文文档` : 'Nuxt 中文文档 - 基于 Vue.js 的全栈 Web 框架',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/icon.png' }
  ],
  htmlAttrs: {
    lang: 'zh-CN'
  },
  script: [
    {
      src: 'https://www.zhcndoc.com/js/common.js',
      async: '',
    },
  ]
})

useSeoMeta({
  ogSiteName: 'Nuxt 中文文档',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterSite: 'nuxt_js'
})

watch(() => search.value?.commandPaletteRef?.query, debounce((query: string) => {
  if (!query) {
    return
  }
  // @ts-ignore
  useTrackEvent('Search', { props: { query: `${query} - ${search.value?.commandPaletteRef.results.length} results` } })
}, 500))

// Provide
provide('navigation', navigation)

const route = useRoute()
const heroBackgroundClass = computed(() => route.meta?.heroBackground || '')
const { isLoading } = useLoadingIndicator()
const appear = ref(false)
const appeared = ref(false)
onMounted(() => {
  setTimeout(() => {
    appear.value = true
    setTimeout(() => {
      appeared.value = true
    }, 1000)
  }, 0)
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <!-- <AppBanner
      id="nuxt-tips-christmas"
      to="https://michaelnthiessen.com/nuxt-tips-collection?aff=J0Emk"
    >
      <div class="flex items-center gap-1 text-black">
        <UIcon
          name="i-ph-magic-wand"
          class="w-5 h-5 flex-shrink-0 pointer-events-none hidden lg:inline-block mr-1"
        />
        <span>Learn Nuxt with a Collection of 100+ Tips!</span>
        <UButton
          label="Learn more"
          color="white"
          trailing-icon="i-ph-arrow-right"
          size="2xs"
          class="rounded-full ml-1"
        />
      </div>
    </AppBanner> -->

    <AppHeader :links="headerLinks" />

    <UMain class="relative">
      <HeroBackground
        class="absolute w-full top-[1px] transition-all text-primary flex-shrink-0"
        :class="[
          isLoading ? 'animate-pulse' : (appear ? 'opacity-100' : 'opacity-0'),
          appeared ? 'duration-[400ms]': 'duration-1000',
          heroBackgroundClass
        ]"
      />
      <NuxtPage />
    </UMain>

    <AppFooter />

    <ClientOnly>
      <UContentSearch
        ref="search"
        :files="files"
        :navigation="navigation[0]?.children"
        :groups="searchGroups"
        :links="searchLinks"
        :fuse="{ resultLimit: 13 }"
      />

      <UNotifications />
    </ClientOnly>
  </div>
</template>
