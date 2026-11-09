<script setup lang="ts">
import type { Template, TemplateHealth } from '#shared/types'

const props = defineProps<{
  template: Template
  health?: TemplateHealth
}>()

const check = computed(() => isTemplateCheckFresh(props.health?.check) ? props.health?.check : undefined)
const checkDetails = computed(() => {
  if (!check.value) return undefined
  if (check.value.status === 'failed') return `使用模板自带的锁文件，在干净的 Vercel Sandbox 中进行每日检查时，${{ install: '安装', build: '构建', start: '启动' }[check.value.step || 'build']}步骤失败。`
  return check.value.live
    ? '根据锁文件安装，在干净的 Vercel Sandbox 中完成构建和启动，并在真实浏览器中打开。每日检查。'
    : '根据锁文件安装，并在干净的 Vercel Sandbox 中完成构建。启动时需要环境变量。每日检查。'
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
    <UTooltip v-if="checkDetails" :text="checkDetails" :content="{ side: 'bottom', align: 'start' }" :ui="{ content: 'max-w-xs h-auto py-1.5', text: 'whitespace-normal text-pretty' }">
      <span class="inline-flex items-center gap-2 cursor-default">
        <TemplatesCheck :health="health" detailed />
        <UBadge
          v-if="check?.status === 'passed' && check.latest"
          label="最新检查"
          color="success"
          variant="subtle"
          size="sm"
          class="rounded-full"
        />
      </span>
    </UTooltip>
    <TemplatesCheck v-else :health="health" />
    <span v-if="health?.updatedAt" class="inline-flex items-center gap-1.5">
      <UIcon name="i-lucide-git-commit-horizontal" class="size-4" />
      最近更新 <NuxtTime :datetime="health.updatedAt" relative />
    </span>
    <span v-if="health?.license" class="inline-flex items-center gap-1.5">
      <UIcon name="i-lucide-scale" class="size-4" />
      {{ health.license }}
    </span>
    <span v-if="health?.stars" class="inline-flex items-center gap-1.5">
      <UIcon name="i-lucide-star" class="size-4" />
      {{ formatNumber(health.stars) }}
    </span>
  </div>
</template>
