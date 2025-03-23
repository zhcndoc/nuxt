<script setup lang="ts">
import { kebabCase } from 'scule'

definePageMeta({
  heroBackground: 'opacity-30 -z-10'
})

const route = useRoute()
const { copy } = useClipboard()

const { data: article } = await useAsyncData(kebabCase(route.path), () => queryCollection('blog').path(route.path).first())
if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${kebabCase(route.path)}-surround`, () => {
  return queryCollectionItemSurroundings('blog', route.path, {
    fields: ['description']
  }).order('date', 'DESC')
})

const title = article.value.seo?.title || article.value.title
const description = article.value.seo?.description || article.value.description

useSeoMeta({
  titleTemplate: '%s - Nuxt 博客 - Nuxt 中文文档',
  title,
  description,
  ogDescription: description,
  ogTitle: `${title} - Nuxt 博客 - Nuxt 中文文档`
})

if (article.value.image) {
  defineOgImage({ url: article.value.image })
} else {
  defineOgImageComponent('Docs', {
    headline: 'Blog',
    title,
    description
  })
}

const authorTwitter = article.value.authors?.[0]?.twitter

const socialLinks = computed(() => !article.value
  ? []
  : [{
      label: 'LinkedIn',
      icon: 'i-simple-icons-linkedin',
      to: `https://www.linkedin.com/sharing/share-offsite/?url=https://nuxt.com${article.value.path}`
    }, {
      label: 'X',
      icon: 'i-simple-icons-x',
      to: `https://x.com/intent/tweet?text=${encodeURIComponent(`${article.value.title}${authorTwitter ? ` by @${article.value.authors[0]!.twitter}` : ''}\n\n`)}https://nuxt.com${article.value.path}`
    }])

function copyLink() {
  copy(`https://nuxt.com${article.value?.path || '/'}`, { title: 'Link copied to clipboard', icon: 'i-lucide-copy-check' })
}

const links = [
  {
    icon: 'i-lucide-pen',
    label: '编辑此文章',
    to: `https://github.com/nuxt/nuxt.com/edit/main/content/${article.value.stem}`,
    target: '_blank'
  }, {
    icon: 'i-lucide-star',
    label: '在 GitHub 上点赞',
    to: 'https://go.nuxt.com/github',
    target: '_blank'
  }, {
    icon: 'i-lucide-hand-heart',
    label: '成为赞助商',
    to: 'https://go.nuxt.com/sponsor',
    target: '_blank'
  }
]
</script>

<template>
  <UContainer>
    <UPage v-if="article">
      <UPageHeader :title="article.title" :description="article.description" :ui="{ headline: 'flex flex-col gap-y-8 items-start' }">
        <template #headline>
          <UBreadcrumb :items="[{ label: 'Nuxt 博客', icon: 'i-lucide-newspaper', to: '/blog' }, { label: article.title }]" class="max-w-full" />
          <div class="flex items-center space-x-2">
            <span>
              {{ article.category }}
            </span>
            <span class="text-(--ui-text-muted)">&middot;&nbsp;&nbsp;<time>{{ formatDateByLocale('en', article.date) }}</time></span>
          </div>
        </template>

        <div class="mt-4 flex flex-wrap items-center gap-6">
          <UUser v-for="(author, index) in article.authors" :key="index" v-bind="author" :description="author.to ? `@${author.to.split('/').pop()}` : undefined" />
        </div>
      </UPageHeader>

      <UPage class="lg:gap-24">
        <UPageBody>
          <ContentRenderer v-if="article.body" :value="article" />

          <div class="flex items-center justify-between mt-12 not-prose">
            <ULink to="/blog" class="text-(--ui-primary)">
              ← 返回博客
            </ULink>
            <div class="flex justify-end items-center gap-1.5">
              <UButton icon="i-lucide-link" variant="ghost" color="neutral" @click="copyLink">
                <span class="sr-only">复制网址</span>
                复制网址
              </UButton>
              <UButton
                v-for="(link, index) in socialLinks"
                :key="index"
                v-bind="link"
                variant="ghost"
                color="neutral"
                target="_blank"
              >
                <span class="sr-only">Nuxt on {{ link.label }}</span>
              </UButton>
            </div>
          </div>

          <USeparator v-if="surround?.length" />

          <UContentSurround :surround="surround" />
        </UPageBody>

        <template #right>
          <UContentToc v-if="article.body && article.body.toc" :links="article.body.toc.links" title="目录" highlight>
            <template #bottom>
              <div class="hidden lg:block space-y-6">
                <UPageLinks title="链接" :links="links" />
                <USeparator type="dashed" />
                <SocialLinks />
                <Ads />
              </div>
            </template>
          </UContentToc>
        </template>
      </UPage>
    </UPage>
  </UContainer>
</template>
