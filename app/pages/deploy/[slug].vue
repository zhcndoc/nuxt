<script lang="ts" setup>
import { withoutTrailingSlash } from 'ufo'
import type { Hosting } from '~/types'

definePageMeta({
  heroBackground: 'opacity-30 -z-10'
})
const route = useRoute()
const { slug } = route.params

const { data: provider } = await useAsyncData(`deploy-${route.params.slug}`, () => queryContent<Hosting>(route.path).findOne())
if (!provider.value) {
  throw createError({ statusCode: 404, statusMessage: 'Hosting Platform not found', fatal: true })
}

const { data: surround } = await useAsyncData(`deploy-${route.params.slug}-surround`, () => queryContent('/deploy')
  .where({ _extension: 'md' })
  .without(['body', 'excerpt'])
  .sort({ featured: 1 })
  .findSurround(withoutTrailingSlash(route.path))
)

const title = provider.value.head?.title || provider.value.title
const description = provider.value.head?.description || provider.value.description

useSeoMeta({
  titleTemplate: '部署 Nuxt 到 %s - Nuxt 中文文档',
  title,
  description,
  ogDescription: description,
  ogTitle: `部署 Nuxt 到 ${title} - Nuxt 中文文档`
})

defineOgImageComponent('Docs', {
  headline: 'Deploy To'
})

const links = []
if (provider.value?.website) {
  links.push({
    icon: 'i-ph-globe',
    label: provider.value?.title,
    to: provider.value?.website,
    target: '_blank'
  })
}
if (provider.value?.nitroPreset) {
  links.push({
    icon: 'i-ph-lightning',
    label: 'Nitro Preset',
    to: `https://nitro.zhcndoc.com/deploy/providers/${provider.value?.nitroPreset}`,
    target: '_blank'
  })
}
links.push({
  icon: 'i-ph-pen',
  label: 'Edit this page',
  to: `https://github.com/nuxt/nuxt.com/edit/main/content/3.deploy/${slug}.md`,
  target: '_blank'
})
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        :description="provider.description"
        headline="Deploy"
        :ui="{
          icon: { base: 'text-black dark:text-white' }
        }"
      >
        <template #title>
          <div class="flex items-center gap-4">
            <UIcon v-if="provider.logoIcon" :name="provider.logoIcon" class="w-10 text-black dark:text-white" />
            <NuxtImg v-else :src="provider.logoSrc" class="w-10 h-10" />

            <span>{{ provider.title }}</span>
          </div>
        </template>

        <div class="absolute top-[68px] -left-[64px] hidden lg:flex">
          <UTooltip text="Back to deployments">
            <UButton
              to="/deploy"
              icon="i-ph-caret-left"
              color="gray"
              :ui="{ rounded: 'rounded-full' }"
              size="lg"
            />
          </UTooltip>
        </div>
      </UPageHeader>

      <UPage>
        <UPageBody prose class="dark:text-gray-300 dark:prose-pre:!bg-gray-800/60">
          <ContentRenderer v-if="provider && provider.body" :value="provider" />

          <div class="wwads-cn wwads-horizontal lg:!hiddenn" data-id="354" />
          <hr v-if="surround?.length">

          <UContentSurround :surround="surround" />
        </UPageBody>

        <template #right>
          <UContentToc title="目录" :links="provider.body.toc.links">
            <template #bottom>
              <div class="hidden lg:block space-y-6" :class="{ '!mt-6': provider.body?.toc?.links?.length }">
                <UDivider v-if="links?.length && provider.body?.toc?.links?.length" type="dashed" />
                <UPageLinks title="链接" :links="links" />
                <UDivider type="dashed" />
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
