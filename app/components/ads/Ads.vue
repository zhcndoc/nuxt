<script setup lang="ts">
// const { $ads } = useNuxtApp()
// const route = useRoute()
// const nuxtApp = useNuxtApp()
// const route = useRoute()
</script>

<template>
  <div class="space-y-3">
    <!-- <AdsMN v-if="route.path.length % 2 === 0" />
    <AdsNuxtCertificate v-else />
    <AdsFallback v-if="$ads.adBlocked.value" />
    <LazyAdsCarbon v-else :key="route.path" /> -->
    <div class="group relative border border-default rounded-md hover:bg-elevated/50 w-full transition-colors p-2 mb-6">
      <ULink
        to="https://www.rainyun.com/mm_?s=zhcndoc"
        target="_blank"
        class="absolute inset-0 z-10"
        data-umami-event="ads-rainyun"
      />
      <div class="flex justify-center w-full ">
        <img src="/assets/ads/rainyun_1.png" class="w-full rounded-sm">
      </div>
    </div>
  </div>
</template>
