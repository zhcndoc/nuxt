<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-80 -z-10'
})
const route = useRoute()
const { fetchList, filteredJobs } = useEnterpriseJobs()

const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())

const title = page.value.head?.title || page.value.title
const description = page.value.head?.description || page.value.description
useSeoMeta({
  titleTemplate: '%s - 工作机会 - Nuxt 中文文档',
  title,
  description,
  ogDescription: description,
  ogTitle: `${title} - 工作机会 - Nuxt 中文文档`
})

defineOgImageComponent('Docs', {
  headline: 'Enterprise'
})

await fetchList()
</script>

<template>
  <UContainer>
    <UPageHero v-bind="page" />

    <UPage id="smooth" class="pt-20 -mt-20">
      <UPageBody class="space-y-8">
        <UPageCard
          v-for="(job, index) in filteredJobs"
          :key="index"
          :to="job.link"
          :title="job.title"
          :description="job.description"
          :ui="{
            divide: '',
            footer: { padding: 'pt-0' },
            title: 'text-lg'
          }"
        >
          <template #icon>
            <UAvatar :src="job.organization.avatar" size="lg" />
          </template>

          <template #footer>
            <div class="flex flex-wrap gap-3">
              <UBadge
                v-for="location of job.locations"
                :key="location"
                :label="location"
                size="lg"
                variant="subtle"
              />
              <UBadge :label="job.remote" size="lg" variant="subtle" />
            </div>
          </template>
        </UPageCard>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
