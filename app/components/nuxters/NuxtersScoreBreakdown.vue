<script setup lang="ts">
import type { Nuxter } from '#shared/types'
import { NUXTERS_CORE_MULTIPLIER, NUXTERS_CORE_REPOS, nuxterScoreBreakdown } from '#shared/utils/nuxters'

const props = defineProps<{
  nuxter: Nuxter
}>()

const { format } = new Intl.NumberFormat('en-US')
const rows = computed(() => nuxterScoreBreakdown(props.nuxter))
const base = computed(() => rows.value.filter(row => !row.bonus && !row.translation))
const translated = computed(() => rows.value.filter(row => row.translation))
const hasTranslations = computed(() => translated.value.some(row => row.amount > 0))
const bonus = computed(() => rows.value.filter(row => row.bonus))
// One scale for both groups, so the bars compare.
const max = computed(() => Math.max(1, ...rows.value.map(row => row.total)))
const coreRepos = NUXTERS_CORE_REPOS.join(', ')
</script>

<template>
  <UModal title="分数如何计算？" description="不同类型的贡献有不同权重，已合并的 PR 权重最高。">
    <slot>
      <UButton
        icon="i-lucide-info"
        color="neutral"
        variant="ghost"
        size="xs"
        aria-label="查看分数构成"
      />
    </slot>

    <template #body>
      <div class="flex flex-col items-center gap-1 py-4 rounded-md bg-elevated/50 mb-6">
        <span class="text-4xl font-bold tabular-nums">{{ format(nuxter.score) }}</span>
        <span class="text-sm text-muted">总分</span>
      </div>

      <ul class="flex flex-col gap-3">
        <li v-for="row in base" :key="row.key" class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between gap-2 text-sm">
            <span class="flex items-center gap-2">
              <UIcon :name="row.icon" class="size-4 text-muted" />
              {{ row.label }}
            </span>
            <span class="tabular-nums text-muted">
              {{ format(row.amount) }} × {{ row.multiplier }} = <span class="font-medium text-highlighted">{{ format(row.total) }}</span>
            </span>
          </div>
          <UProgress :model-value="row.total" :max="max" size="xs" />
        </li>
      </ul>

      <div class="mt-6 pt-6 border-t border-default">
        <p class="flex items-center gap-2 text-sm font-medium text-highlighted">
          <UIcon name="i-lucide-languages" class="size-4 text-primary" />
          翻译贡献
        </p>
        <p class="text-sm text-muted mt-1 mb-4">
          在<ULink to="/translations" class="text-highlighted hover:underline">文档翻译</ULink>中编辑、校验或拒绝的片段。
        </p>

        <ul v-if="hasTranslations" class="flex flex-col gap-3">
          <li v-for="row in translated" :key="row.key" class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between gap-2 text-sm">
              <span class="flex items-center gap-2">
                <UIcon :name="row.icon" class="size-4 text-muted" />
                {{ row.label }}
              </span>
              <span class="tabular-nums text-muted">
                {{ format(row.amount) }} × {{ row.multiplier }} = <span class="font-medium text-highlighted">{{ format(row.total) }}</span>
              </span>
            </div>
            <UProgress :model-value="row.total" :max="max" size="xs" />
          </li>
        </ul>
        <p v-else class="text-sm text-dimmed">
          暂无翻译贡献。
        </p>
      </div>

      <div class="mt-6 pt-6 border-t border-default">
        <p class="flex items-center gap-2 text-sm font-medium text-highlighted">
          <UIcon name="i-lucide-sparkles" class="size-4 text-primary" />
          核心项目加成
        </p>
        <p class="text-sm text-muted mt-1 mb-4">
          在 {{ coreRepos }} 中合并的 PR、有帮助的 Issue 和评论按 {{ NUXTERS_CORE_MULTIPLIER === 2 ? '双倍' : `${NUXTERS_CORE_MULTIPLIER} 倍` }}计分。
        </p>

        <ul v-if="bonus.length" class="flex flex-col gap-3">
          <li v-for="row in bonus" :key="row.key" class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between gap-2 text-sm">
              <span class="flex items-center gap-2">
                <UIcon :name="row.icon" class="size-4 text-muted" />
                {{ row.label }}
              </span>
              <span class="tabular-nums text-muted">
                {{ format(row.amount) }} × {{ row.multiplier }} = <span class="font-medium text-highlighted">+{{ format(row.total) }}</span>
              </span>
            </div>
            <UProgress :model-value="row.total" :max="max" size="xs" color="secondary" />
          </li>
        </ul>
        <p v-else class="text-sm text-dimmed">
          No core contributions yet.
        </p>
      </div>
    </template>
  </UModal>
</template>
