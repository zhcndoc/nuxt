<script setup lang="ts">
import type { PageLink } from '@nuxt/ui'

interface Props {
  hasLinks?: boolean
  communityLinks: PageLink[]
  drawer?: boolean
}

defineProps<Props>()
</script>

<template>
  <USeparator v-if="hasLinks" type="dashed" />
  <UPageLinks title="社区" :links="communityLinks" />
  <USeparator type="dashed" />
  <SocialLinks />
</template>
