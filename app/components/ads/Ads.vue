<script setup lang="ts">
const { $ads } = useNuxtApp()
const route = useRoute()
</script>

<template>
  <div class="space-y-3">
    <!-- <AdsFallback v-if="$ads.adBlocked.value" />
    <LazyAdsCarbon v-else :key="route.path" /> -->
    <div class="wwads-cn wwads-vertical" data-id="354"></div>
  </div>
</template>
