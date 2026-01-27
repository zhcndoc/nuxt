<script setup lang="ts">
import type { Module } from '#shared/types'
import { ModuleProseA, ModuleProseKbd, ModuleProseImg } from '#components'

definePageMeta({
  heroBackground: 'opacity-30 -z-10'
})
const route = useRoute()

const { data: module } = await useFetch<Module>(`/api/v1/modules/${route.params.slug}`, { key: `module-${route.params.slug}` })
if (!module.value) {
  throw createError({ statusCode: 404, statusMessage: 'Module not found', fatal: true })
}

const ownerName = computed(() => {
  const [owner, name] = module.value!.repo.split('#')[0].split('/')
  return `${owner}/${name}`
})

const links = computed(() => module.value
  ? [{
      icon: 'i-lucide-book',
      label: '文档',
      to: `${module.value.website}?utm_source=nuxt.com&utm_medium=aside-module&utm_campaign=nuxt.com`,
      target: '_blank'
    }, {
      icon: 'i-simple-icons-github',
      label: ownerName.value,
      to: module.value.github,
      target: '_blank'
    }, module.value.npm && {
      icon: 'i-simple-icons-npm',
      label: module.value.npm,
      to: `https://npmjs.org/package/${module.value.npm}`,
      target: '_blank'
    }, module.value.learn_more && {
      icon: 'i-lucide-link',
      label: '了解更多',
      to: module.value.learn_more,
      target: '_blank'
    }].filter(Boolean)
  : [])

const contributors = computed(() => {
  const allContributors = module.value.contributors.map(contributor => ({
    label: contributor.username,
    to: `https://github.com/${contributor.username}`,
    avatar: {
      src: `https://markhub.top/github/${contributor.username}?size=20`,
      srcset: `https://markhub.top/github/${contributor.username}?size=40 2x`,
      alt: contributor.username
    }
  }))
  if (allContributors.length > 10) {
    return [...allContributors.slice(0, 10), {
      label: 'View all contributors',
      to: `https://github.com/${module.value.repo}/graphs/contributors`,
      external: true,
      target: '_blank',
      noAvatar: true
    }]
  }

  return allContributors
})

const title = module.value.npm
const description = module.value.description || 'A Nuxt module'
const publishedAgo = useTimeAgo(module.value.stats.publishedAt)
const createdAgo = useTimeAgo(module.value.stats.createdAt)

useSeoMeta({
  titleTemplate: '%s - Nuxt 模块 - Nuxt 中文文档',
  title,
  description,
  ogDescription: description,
  ogTitle: `${title} - Nuxt 模块 - Nuxt 中文文档`
})

defineOgImageComponent('Module', {
  module: module.value,
  headline: 'Nuxt 模块',
  title,
  description
})
</script>

<template>
  <UContainer v-if="module">
    <div v-if="!module.compatibility?.nuxt?.includes('^3') && !module.compatibility?.nuxt?.includes('>=3')" class="pt-8">
      <UAlert
        icon="i-lucide-triangle-alert"
        variant="subtle"
        title="此模块尚未兼容 Nuxt 3"
      >
        <template #description>
          前往 <NuxtLink to="https://v2.nuxt.com" target="_blank" class="underline">
            v2.nuxt.com
          </NuxtLink>
        </template>
      </UAlert>
    </div>
    <UPageHeader :description="module.description" :ui="{ headline: 'mb-8' }">
      <template #headline>
        <UBreadcrumb :items="[{ label: 'Modules', to: '/modules' }, { to: { name: 'modules', query: { category: module.category } }, label: module.category }, { label: module.npm }]" />
      </template>
      <template #title>
        <div class="flex items-center gap-4">
          <UAvatar
            :src="moduleImage(module.icon)"
            :icon="moduleIcon(module.category)"
            :alt="module.name"
            size="xl"
            class="-m-[4px] rounded-none bg-transparent"
          />

          <div>
            {{ module.npm }}

            <UTooltip v-if="module.type === 'official'" text="Official module" class="tracking-normal">
              <UIcon name="i-lucide-medal" class="size-6 text-primary" />
            </UTooltip>
          </div>
        </div>
      </template>

      <div class="flex flex-col lg:flex-row lg:items-center gap-3 mt-4">
        <UTooltip text="每月 NPM 下载量">
          <NuxtLink class="flex items-center gap-1.5" :to="`https://npm.chart.dev/${module.npm}`" target="_blank">
            <UIcon name="i-lucide-circle-arrow-down" class="size-5 shrink-0" />
            <span class="text-sm font-medium">{{ formatNumber(module.stats.downloads) }} 下载量</span>
          </NuxtLink>
        </UTooltip>

        <span class="hidden lg:block text-muted">&bull;</span>

        <UTooltip text="GitHub 星标">
          <NuxtLink class="flex items-center gap-1.5" :to="`https://github.com/${(module.repo || '').split('#')[0]}`" target="_blank">
            <UIcon name="i-lucide-star" class="size-5 shrink-0" />
            <span class="text-sm font-medium">{{ formatNumber(module.stats.stars || 0) }} 星标</span>
          </NuxtLink>
        </UTooltip>

        <span class="hidden lg:block text-muted">&bull;</span>

        <UTooltip text="最新版本">
          <NuxtLink class="flex items-center gap-1.5" :to="`${(module.github || '').split('/tree/main/')[0]}/releases`" target="_blank">
            <UIcon name="i-lucide-tag" class="size-5 shrink-0" />
            <span class="text-sm font-medium">v{{ module.stats.version }}</span>
          </NuxtLink>
        </UTooltip>

        <div class="mx-3 h-6 border-l border-gray-200 dark:border-gray-800 w-px hidden lg:block" />

        <div v-for="(maintainer, index) in module.maintainers" :key="maintainer.github" class="flex items-center gap-3">
          <NuxtLink :to="`https://github.com/${maintainer.github}`" target="_blank" class="flex items-center gap-1.5 hover:text-primary">
            <UAvatar :src="`https://markhub.top/github/${maintainer.github}?size=20`" :srcset="`https://markhub.top/github/${maintainer.github}?size=40 2x`" :alt="maintainer.github" size="xs" />
            <span class="text-sm font-medium">{{ maintainer.github }}</span>
          </NuxtLink>

          <span v-if="index < module.maintainers.length - 1" class="hidden lg:block text-muted">&bull;</span>
        </div>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody>
        <ContentRenderer v-if="module.readme?.body" :value="module.readme" :components="{ a: ModuleProseA, img: ModuleProseImg, kbd: ModuleProseKbd }" class="first:[&_picture]:block first:[&_picture]:mb-4" />
        <div class="wwads-cn wwads-horizontal w-full my-4" data-id="354" />
      </UPageBody>

      <template #right>
        <UContentToc :links="module.readme?.toc?.links" title="目录">
          <template #top>
            <Ads />
          </template>
          <template #bottom>
            <div class="hidden lg:block space-y-6">
              <UPageLinks title="链接" :links="links" />

              <USeparator type="dashed" />

              <UPageLinks
                title="Details"
                :links="[
                  {
                    label: `Updated ${publishedAgo}`,
                    to: `https://github.com/${module.repo}`,
                    icon: 'i-lucide-radio'
                  },
                  {
                    label: `Created ${createdAgo}`,
                    to: `https://github.com/${module.repo}`,
                    icon: 'i-lucide-package'
                  }
                ]"
              />

              <UPageLinks :links="contributors">
                <template #title>
                  贡献者 <UBadge :label="module.contributors.length.toString()" color="neutral" variant="subtle" size="sm" class="rounded-full" />
                </template>

                <template #link-leading="{ link }">
                  <UAvatar v-if="!(link as any).noAvatar" :src="`https://markhub.top/github/${link.label}?size=20`" :srcset="`https://markhub.top/github/${link.label}?size=40 2x`" class="size-5" />
                </template>
              </UPageLinks>
              <USeparator type="dashed" />
              <SocialLinks />
              <Ads />
            </div>
          </template>
        </UContentToc>
      </template>
    </UPage>
  </UContainer>
</template>
