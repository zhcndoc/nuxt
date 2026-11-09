<script setup lang="ts">
const { meta: docsMeta } = useDocsVersion()
</script>

<template>
  <div v-if="docsMeta.endOfLife" class="pt-4 sm:pt-6">
    <UAlert
      icon="i-lucide-triangle-alert"
      variant="subtle"
      color="warning"
      :title="`Nuxt ${docsMeta.major} 已于 ${docsMeta.endOfLife} 结束生命周期`"
    >
      <template #description>
        此版本将不再接收错误修复或安全补丁。
        <NuxtLink :to="docsMeta.upgradePath" class="underline">
          升级到 Nuxt 4
        </NuxtLink>
        <template v-if="docsMeta.extendedSupport">
          或获取
          <NuxtLink :to="docsMeta.extendedSupport" target="_blank" class="underline">
            HeroDevs 提供的延长支持
          </NuxtLink>
        </template>
      </template>
    </UAlert>
  </div>
</template>
