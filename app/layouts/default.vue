<script setup lang="ts">
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
  <div :class="[(route.path.startsWith('/docs/') || route.path.startsWith('/deploy')) && 'root']">
    <UBanner
      id="mn-nuxt-b"
      title="雨云 RainYun - 企业级云计算服务提供商：新用户注册立享五折！"
      icon="i-lucide-server"
      to="https://www.rainyun.com/mm_?s=zhcndoc"
      target="_blank"
      data-umami-event="ads-rainyun"
      :actions="[
        {
          label: '立即注册',
          color: 'neutral',
          variant: 'outline',
          trailingIcon: 'i-lucide-arrow-right',
          to: 'https://www.rainyun.com/mm_?s=zhcndoc',
          target: '_blank'
        }
      ]"
    />

    <Header />

    <UMain class="relative">
      <HeroBackground
        class="absolute w-full -top-px transition-all text-primary shrink-0 -z-10"
        :class="[
          isLoading ? 'animate-pulse' : (appear ? heroBackgroundClass : 'opacity-0'),
          appeared ? 'duration-[400ms]' : 'duration-1000'
        ]"
      />

      <NuxtPage />
    </UMain>

    <AppFooter />
  </div>
</template>
