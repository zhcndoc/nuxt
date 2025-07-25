<script setup lang="ts">
import { kebabCase } from 'scule'

const route = useRoute()
definePageMeta({
  heroBackground: 'opacity-70 -z-10'
})

const [{ data: page }, { data: teams }] = await Promise.all([
  useAsyncData(kebabCase(route.path), () => queryCollection('team').first()),
  useFetch('/api/teams', {
    key: 'teams',
    default: () => ([{ name: 'Core Team', team: [], link: 'https://github.com/orgs/nuxt/teams/core' }, { name: 'Ecosystem Team', team: [], link: 'https://github.com/orgs/nuxt/teams/ecosystem' }]),
    transform: data => [
      {
        name: 'Core Team',
        team: data.core,
        link: 'https://github.com/orgs/nuxt/teams/core'
      },
      {
        name: 'Ecosystem Team',
        team: data.ecosystem,
        link: 'https://github.com/orgs/nuxt/teams/ecosystem'
      }
    ]
  })
])

const title = page.value!.title
const description = page.value!.description

useSeoMeta({
  titleTemplate: '%s',
  title,
  description,
  ogDescription: description,
  ogTitle: title
})
defineOgImageComponent('Docs', {
  title,
  description
})

const icons = {
  website: 'i-lucide-link',
  twitter: 'i-simple-icons-x',
  twitch: 'i-simple-icons-twitch',
  youtube: 'i-simple-icons-youtube',
  instagram: 'i-simple-icons-instagram',
  linkedin: 'i-simple-icons-linkedin',
  mastodon: 'i-simple-icons-mastodon',
  bluesky: 'i-simple-icons-bluesky',
  github: 'i-simple-icons-github'
}
</script>

<template>
  <UContainer v-if="page">
    <UPageHero
      :title="title"
      :description="description"
    />

    <UPage>
      <UPageBody class="mt-0">
        <template v-for="(team, index) of teams" :key="index">
          <h2 class="font-bold text-2xl mb-4 flex gap-2 items-center justify-between" :class="{ 'mt-12 md:mt-24': !!index }">
            <span>{{ team.name }}</span>
          </h2>
          <UPageGrid class="xl:grid-cols-4">
            <UPageCard
              v-for="(user, teamIndex) in team.team"
              :key="teamIndex"
              :title="user.name"
              :description="[user.pronouns, user.location].filter(Boolean).join(' ・ ')"
              :ui="{
                container: 'gap-y-3',
                leading: 'flex justify-center',
                wrapper: 'items-center',
                title: 'text-center',
                description: 'text-center'
              }"
              variant="subtle"
            >
              <template #leading>
                <UAvatar :src="`https://markhub.top/github/${user.login}?size=80`" :srcset="`https://markhub.top/github/${user.login}?size=160 2x`" size="3xl" class="mx-auto" />
              </template>

              <div class="flex items-center justify-center gap-1">
                <UButton
                  v-for="(link, key) in user.socialAccounts"
                  :key="key"
                  color="neutral"
                  variant="link"
                  :to="link.url"
                  :icon="icons[key] || icons.website"
                  :alt="`Link to ${user.name}'s ${key} profile`"
                  target="_blank"
                  size="sm"
                />
                <UButton
                  :to="`https://github.com/${user.login}`"
                  color="neutral"
                  variant="link"
                  :alt="`Link to ${user.name}'s GitHub profile`"
                  :icon="icons.github"
                  target="_blank"
                />
                <UButton
                  v-if="user.websiteUrl"
                  :to="user.websiteUrl"
                  color="neutral"
                  variant="link"
                  :alt="`Link to ${user.name}'s personal website`"
                  :icon="icons.website"
                  target="_blank"
                />
              </div>
              <div v-if="user.sponsorsListing" class="flex items-center justify-center">
                <UButton
                  :to="user.sponsorsListing"
                  target="_blank"
                  color="neutral"
                  variant="subtle"
                  icon="i-lucide-heart"
                  label="Sponsor"
                  :ui="{ leadingIcon: 'text-pink-500' }"
                />
              </div>
            </UPageCard>
          </UPageGrid>
        </template>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
