<script setup lang="ts">
import type { SegmentStatus } from '@diglot/core'
import { L10N_STATUS_PATH, L10N_STRINGS, type L10nLocaleSummary } from '#shared/utils/l10n'

const { data } = await useFetch<{ locales: L10nLocaleSummary[] }>(L10N_STATUS_PATH, { key: 'l10n-status', default: () => ({ locales: [] }) })

const title = '文档翻译'
const description = '查看 Nuxt 文档各语言翻译的审核进度和审核者。'
useSeoMeta({ title, description, ogTitle: title, ogDescription: description })

const STATUSES: Array<{ status: SegmentStatus, label: string, color: string }> = [
  { status: 'verified', label: '已校验', color: 'bg-success' },
  { status: 'edited', label: '已编辑', color: 'bg-info' },
  { status: 'machine', label: '机器翻译', color: 'bg-warning' },
  { status: 'pending-review', label: '待审核', color: 'bg-[repeating-linear-gradient(45deg,var(--ui-warning)_0_2px,transparent_2px_5px)]' },
  { status: 'rejected', label: '已拒绝', color: 'bg-error' },
  { status: 'untranslated', label: '未翻译', color: 'bg-accented' }
]

const percent = (value?: number) => value === undefined ? 'n/a' : `${Math.round(value * 100)}%`
const share = (locale: L10nLocaleSummary, status: SegmentStatus) => locale.coverage.words ? (locale.coverage.byStatus[status] ?? 0) / locale.coverage.words : 0
</script>

<template>
  <UPage>
    <UPageHero :title="title" :description="description" />

    <UPageBody class="mt-0">
      <UContainer class="space-y-16">
        <section v-for="locale in data.locales" :key="locale.locale" class="space-y-6">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="text-2xl font-bold">
              <span :lang="locale.locale">{{ L10N_STRINGS[locale.locale].language }}</span> <span class="text-muted font-mono text-base">{{ locale.locale }}</span>
            </h2>
            <span class="text-xs text-muted font-mono">nuxt/translations@{{ locale.sha.slice(0, 7) }}</span>
          </div>

          <UAlert
            v-if="locale.recommendation"
            color="neutral"
            variant="subtle"
            icon="i-lucide-scale"
            :description="locale.recommendation.reason"
          />

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <UPageCard :title="percent(locale.reviewed)" description="词汇已编辑或校验" />
            <UPageCard :title="String(locale.indexable)" :description="`可索引页面，共 ${locale.pageCount} 页${locale.readyToIndex ? `，另有 ${locale.readyToIndex} 页审核进度已足够` : ''}`" />
            <UPageCard :title="String(locale.pending.segments)" :description="locale.pending.segments ? `待审核，最早 ${locale.pending.oldestDays} 天，平均 ${Math.round(locale.pending.medianDays ?? 0)} 天` : '待审核'" />
            <UPageCard :title="String(locale.activeReviewers.length)" description="过去 8 周内活跃的审核者" />
            <UPageCard :title="percent(locale.approvalRate)" description="已审核机器翻译中保留原文的比例" />
            <UPageCard :title="percent(locale.editRatio)" description="机器翻译编辑后的改动比例中位数" />
            <UPageCard :title="locale.machine ? '开启' : '关闭'" description="机器翻译" />
          </div>

          <div class="space-y-2">
            <div class="flex h-3 overflow-hidden rounded-full bg-elevated" role="img" :aria-label="STATUSES.map(({ status, label }) => `${label} ${percent(share(locale, status))}`).join(', ')">
              <div v-for="{ status, color } in STATUSES" :key="status" :class="color" :style="{ width: `${share(locale, status) * 100}%` }" />
            </div>
            <ul class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              <li v-for="{ status, label, color } in STATUSES" :key="status" class="flex items-center gap-1.5">
                <span class="size-2 rounded-full" :class="color" />{{ label }} {{ percent(share(locale, status)) }}
              </li>
            </ul>
          </div>

          <div v-if="locale.activeReviewers.length" class="flex flex-wrap gap-2">
            <UBadge
              v-for="reviewer in locale.activeReviewers"
              :key="reviewer.login"
              :label="`@${reviewer.login} · ${reviewer.count}`"
              color="neutral"
              variant="subtle"
            />
          </div>

          <TranslationsPages :locale="locale.locale" />
        </section>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
