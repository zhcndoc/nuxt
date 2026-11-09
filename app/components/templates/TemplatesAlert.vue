<script setup lang="ts">
import type { Template, TemplateHealth } from '#shared/types'

const props = defineProps<{
  template: Template
  health?: TemplateHealth
  /** Whether another template of the same category builds today, so the link never lands on an empty list. */
  hasWorkingAlternative?: boolean
}>()

const STEPS = ['install', 'build', 'start'] as const
const stepLabels = { install: '安装', build: '构建', start: '启动' }

const archived = computed(() => !!props.health?.archived)
const failed = computed(() => !archived.value && props.health?.check?.status === 'failed' ? props.health.check : undefined)
const outdated = computed(() => !failed.value && !archived.value && isOutdated(props.health))
const failedAt = computed(() => STEPS.findIndex(step => step === failed.value?.step))
const issuesUrl = computed(() => props.template.repo && `https://github.com/${props.template.repo}/issues`)
const category = computed(() => props.hasWorkingAlternative ? TEMPLATE_CATEGORIES.find(item => item.value === props.template.category) : undefined)
const alternatives = computed(() => ({ path: '/templates', query: { status: 'working', category: category.value?.value } }))
</script>

<template>
  <div
    v-if="failed || archived || outdated"
    role="status"
    class="rounded-lg ring ring-default bg-elevated/30 p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
  >
    <div class="min-w-0 flex-1 flex flex-col gap-1">
      <p class="flex items-center gap-2 text-sm font-medium text-highlighted">
        <span class="size-1.5 shrink-0 rounded-full" :class="failed ? 'bg-error' : 'bg-warning'" />
        {{ failed ? (failed.passedAt ? `曾通过检查，但现在在${stepLabels[failed.step || 'build']}步骤失败` : `目前无法${stepLabels[failed.step || 'build']}`) : archived ? '作者已归档' : `仍在使用 Nuxt ${health?.nuxtMajor}` }}
      </p>
      <p class="text-sm text-muted text-pretty">
        <template v-if="failed?.passedAt">
          它在 <NuxtTime :datetime="failed.passedAt" relative /> 通过每日检查，现在在{{ stepLabels[failed.step || 'build'] }}步骤停止。
          <template v-if="canLivePreview(template)">
            重新通过检查前，在线预览不可用。
          </template>
        </template>
        <template v-else-if="failed">
          每日检查在{{ stepLabels[failed.step || 'build'] }}步骤停止，建议先修复后再基于此模板构建。
        </template>
        <template v-else-if="archived">
          此模板的仓库已归档，不会再获得错误修复或 Nuxt 版本升级。
        </template>
        <template v-else>
          此模板尚未升级到 Nuxt {{ CURRENT_NUXT_MAJOR }}，使用前请先升级。
        </template>
      </p>
    </div>

    <ol v-if="failed && failedAt >= 0" class="w-full sm:w-48 shrink-0 grid grid-cols-3 gap-1" aria-label="每日检查">
      <li v-for="(step, index) in STEPS" :key="step" class="flex flex-col gap-1.5">
        <span class="h-1 rounded-full" :class="index < failedAt ? 'bg-accented' : index === failedAt ? 'bg-error' : 'bg-elevated'" />
        <span class="text-xs capitalize" :class="index < failedAt ? 'text-muted' : index === failedAt ? 'text-highlighted' : 'text-dimmed'">
          {{ stepLabels[step] }}
          <span class="sr-only">{{ index < failedAt ? '已通过' : index === failedAt ? '失败' : '已跳过' }}</span>
        </span>
      </li>
    </ol>

    <div class="flex items-center gap-1 shrink-0 -ms-2.5 sm:ms-0">
      <template v-if="failed || archived">
        <UButton
          v-if="failed && issuesUrl"
          :to="issuesUrl"
          target="_blank"
          label="问题"
          color="neutral"
          variant="ghost"
          size="sm"
        />
        <UButton
          :to="alternatives"
          :label="category ? `可用的${category.label}模板` : '可用模板'"
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="subtle"
          size="sm"
          class="ring-default"
        />
      </template>
      <UButton
        v-else
        to="/docs/4.x/getting-started/upgrade"
        label="升级指南"
        trailing-icon="i-lucide-arrow-right"
        color="neutral"
        variant="subtle"
        size="sm"
        class="ring-default"
      />
    </div>
  </div>
</template>
