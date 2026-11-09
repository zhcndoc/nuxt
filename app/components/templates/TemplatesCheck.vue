<script setup lang="ts">
import type { TemplateHealth } from '#shared/types'

const props = defineProps<{
  health?: TemplateHealth
  /** Adds when the check ran. */
  detailed?: boolean
}>()

const check = computed(() => isTemplateCheckFresh(props.health?.check) ? props.health?.check : undefined)
const version = computed(() => check.value?.nuxt?.replace(/-\d+\.[\da-f]+$/, ' 夜间版'))
const outdated = computed(() => isOutdated(props.health))
const failures = { install: '安装失败', build: '构建失败', start: '启动失败' }
</script>

<template>
  <span v-if="check" class="inline-flex items-center gap-1.5 min-w-0">
    <template v-if="check.status === 'failed'">
      <UIcon name="i-lucide-circle-x" class="size-[1.15em] shrink-0 text-error" />
      <span class="truncate text-error">{{ failures[check.step || 'build'] }}</span>
    </template>
    <template v-else>
      <UIcon :name="outdated ? 'i-lucide-triangle-alert' : 'i-lucide-circle-check'" class="size-[1.15em] shrink-0" :class="outdated ? 'text-warning' : 'text-success'" />
      <span class="truncate" :class="outdated ? 'text-warning' : 'text-default'">基于 Nuxt {{ version }} 构建</span>
    </template>
    <span v-if="detailed" class="shrink-0 text-muted">· 检查于 <NuxtTime :datetime="check.checkedAt" relative /></span>
  </span>
  <span v-else-if="outdated && health?.nuxtMajor" class="inline-flex items-center gap-1.5 text-warning">
    <UIcon name="i-lucide-triangle-alert" class="size-[1.15em] shrink-0" />
    Nuxt {{ health.nuxtMajor }}
  </span>
</template>
