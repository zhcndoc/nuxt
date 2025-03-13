<script setup lang="ts">
import type { Module } from '~/types'
import { ModuleProseA, ModuleProseImg } from '#components'

definePageMeta({
  heroBackground: 'opacity-30 -z-10'
})
const route = useRoute()

const { data: module } = await useFetch<Module>(`https://api.nuxt.com/modules/${route.params.slug}`, {
  key: `module-${route.params.slug}`
})
if (!module.value) {
  throw createError({ statusCode: 404, statusMessage: 'Module not found', fatal: true })
}

const ownerName = computed(() => {
  const [owner, name] = module.value.repo.split('#')[0].split('/')
  return `${owner}/${name}`
})

const links = computed(() => [{
  icon: 'i-ph-book-bookmark',
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
  icon: 'i-ph-link',
  label: '了解更多',
  to: module.value.learn_more,
  target: '_blank'
}].filter(Boolean))

const contributors = computed(() => {
  const allContributors = module.value.contributors.map(contributor => ({
    label: contributor.username,
    to: `https://github.com/${contributor.username}`,
    avatar: {
      src: `https://avatar.ikxin.com/github/${contributor.username}?size=20`,
      srcset: `https://avatar.ikxin.com/github/${contributor.username}?size=40 2x`,
      alt: contributor.username
    }
  }))
  if (allContributors.length > 10) {
    return [...allContributors.slice(0, 10), {
      label: 'View all contributors',
      to: `https://github.com/${module.value.repo}/graphs/contributors`,
      external: true,
      target: '_blank'
    }]
  }

  return allContributors
})

const title = module.value.name.charAt(0).toUpperCase() + module.value.name.slice(1)
const description = module.value.description || 'A Nuxt module'

useSeoMeta({
  titleTemplate: '%s - Nuxt 模块 - Nuxt 中文文档',
  title,
  description,
  ogDescription: description,
  ogTitle: `${title} - Nuxt 模块 - Nuxt 中文文档`
})

defineOgImageComponent('Docs', {
  headline: 'Nuxt 模块'
})
</script>

<template>
  <UContainer>
    <div v-if="!module.compatibility?.nuxt?.includes('^3') && !module.compatibility?.nuxt?.includes('>=3')" class="pt-8">
      <UAlert
        icon="i-ph-warning"
        color="orange"
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
        <UBreadcrumb :links="[{ label: 'Modules', to: '/modules' }, { to: { name: 'modules', query: { category: module.category } }, label: module.category }, { label: module.npm }]" />
      </template>
      <template #title>
        <div class="flex items-center gap-4">
          <UAvatar
            :src="moduleImage(module.icon)"
            :icon="moduleIcon(module.category)"
            :alt="module.name"
            size="lg"
            :ui="{ rounded: 'rounded-lg' }"
            class="-m-[4px]"
          />

          <div>
            {{ module.npm }}

            <UTooltip v-if="module.type === 'official'" text="Official module" class="tracking-normal">
              <UIcon name="i-ph-medal" class="h-6 w-6 text-primary" />
            </UTooltip>
          </div>
        </div>
      </template>

      <div class="flex flex-col lg:flex-row lg:items-center gap-3 mt-4">
        <UTooltip text="每月 NPM 下载量">
          <NuxtLink class="flex items-center gap-1.5" :to="`https://npm.chart.dev/${module.npm}`" target="_blank">
            <UIcon name="i-ph-arrow-circle-down" class="w-5 h-5 flex-shrink-0" />
            <span class="text-sm font-medium">{{ formatNumber(module.stats.downloads) }} 下载量</span>
          </NuxtLink>
        </UTooltip>

        <span class="hidden lg:block text-gray-500 dark:text-gray-400">&bull;</span>

        <UTooltip text="GitHub 星标">
          <NuxtLink class="flex items-center gap-1.5" :to="`https://github.com/${module.repo}`" target="_blank">
            <UIcon name="i-ph-star" class="w-5 h-5 flex-shrink-0" />
            <span class="text-sm font-medium">{{ formatNumber(module.stats.stars || 0) }} 星标</span>
          </NuxtLink>
        </UTooltip>

        <span class="hidden lg:block text-gray-500 dark:text-gray-400">&bull;</span>

        <UTooltip text="最新版本">
          <NuxtLink class="flex items-center gap-1.5" :to="`${module.github}/releases`" target="_blank">
            <UIcon name="i-ph-tag" class="w-5 h-5 flex-shrink-0" />
            <span class="text-sm font-medium">v{{ module.stats.version }}</span>
          </NuxtLink>
        </UTooltip>

        <div class="mx-3 h-6 border-l border-gray-200 dark:border-gray-800 w-px hidden lg:block" />

        <div v-for="(maintainer, index) in module.maintainers" :key="maintainer.github" class="flex items-center gap-3">
          <NuxtLink :to="`https://github.com/${maintainer.github}`" target="_blank" class="flex items-center gap-1.5 hover:text-primary">
            <UAvatar :src="`https://avatar.ikxin.com/github/${maintainer.github}?size=20`" :srcset="`https://avatar.ikxin.com/github/${maintainer.github}?size=40 2x`" :alt="maintainer.github" size="2xs" />
            <span class="text-sm font-medium">{{ maintainer.github }}</span>
          </NuxtLink>

          <span v-if="index < module.maintainers.length - 1" class="hidden lg:block text-gray-500 dark:text-gray-400">&bull;</span>
        </div>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody prose class="dark:text-gray-300 dark:prose-pre:!bg-gray-800/60">
        <ContentRendererMarkdown v-if="module.readme?.body" :value="module.readme" class="module-readme" :components="{ a: ModuleProseA, img: ModuleProseImg }" />
        <div class="wwads-cn wwads-horizontal" data-id="354" />
      </UPageBody>

      <template #right>
        <UContentToc title="目录">
          <template #bottom>
            <div class="hidden lg:block space-y-6">
              <UPageLinks title="链接" :links="links" />

              <UDivider type="dashed" />

              <UPageLinks :links="contributors">
                <template #title>
                  贡献者 <UBadge :label="module.contributors.length.toString()" color="gray" size="xs" :ui="{ rounded: 'rounded-full' }" />
                </template>
              </UPageLinks>
              <UDivider type="dashed" />
              <SocialLinks />
              <Ads />
            </div>
          </template>
        </UContentToc>
      </template>
    </UPage>
  </UContainer>
</template>

<style lang="postcss">
.module-readme {

  /* empty code lines */
  .shiki code .line:empty {
    @apply hidden;
  }

  /* force rounded on prose code */
  .prose-code {
    @apply rounded-md;
  }

  /* Fix badges */
  p {
    a img {
      @apply inline-block my-0 mr-1;
    }

    a:hover {
      @apply border-none opacity-90;
    }
  }
}
</style>
