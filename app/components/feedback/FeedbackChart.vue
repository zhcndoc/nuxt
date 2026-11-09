<script setup lang="ts">
import type { ChartCategory } from '@nuxt/ui'

type PageAnalytic = {
  path: string
  total: number
  positive: number
  negative: number
  averageScore: number
  positivePercentage: number
  feedback: any[]
  lastFeedback: any
  createdAt: Date
  updatedAt: Date
}

interface Props {
  pageAnalytics: PageAnalytic[]
}

const props = defineProps<Props>()
const { dateRange } = useDateRange()

const chartType = ref<'line' | 'compare' | 'overall'>('line')

const selectedPagePaths = ref<string[]>([])
const showPageSelector = ref(false)
const pageSearchQuery = ref('')

const hasValidData = computed(() => {
  return props.pageAnalytics && props.pageAnalytics.length > 0 && props.pageAnalytics.some(p => p && p.total > 0)
})

const availablePages = computed(() => {
  if (!props.pageAnalytics) return []

  const pages = props.pageAnalytics
    .filter(p => p && p.total > 0)
    .sort((a, b) => b.total - a.total)
    .map(page => ({
      path: page.path,
      title: page.lastFeedback?.title || page.path,
      total: page.total,
      score: page.averageScore
    }))

  if (!pageSearchQuery.value.trim()) {
    return pages
  }

  const searchTerm = pageSearchQuery.value.toLowerCase().trim()
  return pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm)
    || page.path.toLowerCase().includes(searchTerm)
  )
})

watch(() => props.pageAnalytics, (analytics) => {
  if (selectedPagePaths.value.length === 0 && analytics && analytics.length > 0) {
    const validAnalytics = analytics.filter(p => p && p.total > 0)
    if (validAnalytics.length > 0) {
      const topPages = validAnalytics
        .sort((a, b) => b.total - a.total)
        .slice(0, Math.min(5, validAnalytics.length))
      selectedPagePaths.value = topPages.map(p => p.path)
    }
  }
}, { immediate: true })

// `UChart` positions points by label, so ranges longer than a year need the year to keep days unique
function formatDay(date: Date, daysDiff: number) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: daysDiff > 365 ? 'numeric' : undefined })
}

const overallChartData = computed(() => {
  const data: any[] = []
  const endDate = dateRange.value.end
  const startDate = dateRange.value.start

  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  const dailyScores: Record<string, number[]> = {}

  if (hasValidData.value && props.pageAnalytics) {
    for (const page of props.pageAnalytics) {
      if (!page || !page.feedback) continue

      for (const feedback of page.feedback) {
        const feedbackDate = new Date(feedback.createdAt)

        if (feedbackDate >= startDate && feedbackDate <= endDate) {
          const dateStr = feedbackDate.toISOString().split('T')[0]
          if (!dailyScores[dateStr]) {
            dailyScores[dateStr] = []
          }

          const ratingScore = FEEDBACK_OPTIONS.find(opt => opt.value === feedback.rating)?.score || 0
          dailyScores[dateStr].push(ratingScore)
        }
      }
    }
  }

  let lastKnownValue = 0

  for (let i = daysDiff - 1; i >= 0; i--) {
    const date = new Date(endDate)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const entry: any = {
      date: dateStr,
      day: formatDay(date, daysDiff)
    }

    if (hasValidData.value && dailyScores[dateStr] && dailyScores[dateStr].length > 0) {
      const dayAverage = dailyScores[dateStr].reduce((sum, score) => sum + score, 0) / dailyScores[dateStr].length
      lastKnownValue = Math.min(4.0, Number(dayAverage.toFixed(2)))
    }

    entry.average = lastKnownValue

    data.push(entry)
  }

  return data
})

const timeBasedChartData = computed(() => {
  const data: any[] = []
  const endDate = dateRange.value.end
  const startDate = dateRange.value.start

  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  if (!hasValidData.value || selectedPagePaths.value.length === 0 || !props.pageAnalytics) {
    for (let i = daysDiff - 1; i >= 0; i--) {
      const date = new Date(endDate)
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString().split('T')[0],
        day: formatDay(date, daysDiff),
        placeholder: 0
      })
    }
    return data
  }

  const dailyScores: Record<string, Record<string, number[]>> = {}

  const selectedPages = props.pageAnalytics.filter(p => p && selectedPagePaths.value.includes(p.path))

  for (const page of selectedPages) {
    if (!page || !page.feedback) continue

    const pageKey = page.path

    for (const feedback of page.feedback) {
      const feedbackDate = new Date(feedback.createdAt)

      if (feedbackDate >= startDate && feedbackDate <= endDate) {
        const dateStr = feedbackDate.toISOString().split('T')[0]
        if (!dailyScores[dateStr]) {
          dailyScores[dateStr] = {}
        }
        if (!dailyScores[dateStr][pageKey]) {
          dailyScores[dateStr][pageKey] = []
        }

        const ratingScore = FEEDBACK_OPTIONS.find(opt => opt.value === feedback.rating)?.score || 0
        dailyScores[dateStr][pageKey].push(ratingScore)
      }
    }
  }

  const lastKnownValues: Record<string, number> = {}

  for (let i = daysDiff - 1; i >= 0; i--) {
    const date = new Date(endDate)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const entry: any = {
      date: dateStr,
      day: formatDay(date, daysDiff)
    }

    for (const page of selectedPages) {
      if (!page) continue

      const pageKey = page.path

      if (dailyScores[dateStr] && dailyScores[dateStr][pageKey] && dailyScores[dateStr][pageKey].length > 0) {
        const dayAverage = dailyScores[dateStr][pageKey].reduce((sum, score) => sum + score, 0) / dailyScores[dateStr][pageKey].length
        lastKnownValues[pageKey] = Math.min(4.0, Number(dayAverage.toFixed(2)))
      }

      entry[pageKey] = lastKnownValues[pageKey] || 0
    }

    data.push(entry)
  }

  return data
})

const comparisonChartData = computed(() => {
  if (!hasValidData.value || selectedPagePaths.value.length === 0 || !props.pageAnalytics) {
    return [{ page: '暂无数据', positive: 0, negative: 0 }]
  }

  // `UChart` positions bars by label, so truncated titles must stay unique
  const labels = new Set<string>()

  return props.pageAnalytics
    .filter(p => p && selectedPagePaths.value.includes(p.path))
    .map((page) => {
      const title = page.lastFeedback?.title || page.path
      const shortTitle = title.length > 15 ? title.substring(0, 15) + '...' : title
      let label = shortTitle
      for (let count = 2; labels.has(label); count++) {
        label = `${shortTitle} (${count})`
      }
      labels.add(label)

      return {
        page: label,
        positive: page.positive,
        negative: page.negative
      }
    })
})

const chartData = computed(() => {
  if (chartType.value === 'compare') return comparisonChartData.value
  if (chartType.value === 'overall') return overallChartData.value
  return timeBasedChartData.value
})

const chartCategories = computed<ChartCategory[]>(() => {
  if (!hasValidData.value) {
    return [{ key: 'placeholder', label: '暂无数据', color: 'neutral' }]
  }

  if (chartType.value === 'compare') {
    return [
      { key: 'positive', label: '正面', color: 'success' },
      { key: 'negative', label: '负面', color: 'error' }
    ]
  }

  if (chartType.value === 'overall') {
    return [{ key: 'average', label: '总体评分' }]
  }

  if (selectedPagePaths.value.length === 0 || !props.pageAnalytics) {
    return [{ key: 'placeholder', label: '未选择页面', color: 'neutral' }]
  }

  return props.pageAnalytics
    .filter(p => p && selectedPagePaths.value.includes(p.path))
    .map((page) => {
      const title = page.lastFeedback?.title || page.path
      return {
        key: page.path,
        label: title.length > 25 ? title.substring(0, 25) + '...' : title
      }
    })
})

const yFormatter = (value: number) => {
  if (chartType.value === 'compare') {
    return Math.round(value).toString()
  }
  return value === 0 ? '0' : `${Number(value).toFixed(1)}/4`
}

const dateRangeLabel = computed(() => {
  if (chartType.value === 'compare') {
    return `已选页面（${selectedPagePaths.value.length}）`
  }

  const daysDiff = Math.ceil((dateRange.value.end.getTime() - dateRange.value.start.getTime()) / (1000 * 60 * 60 * 24))
  if (daysDiff <= 7) return `最近 ${daysDiff} 天`
  if (daysDiff <= 31) return `最近 ${daysDiff} 天`
  if (daysDiff <= 93) return `最近 ${Math.round(daysDiff / 30)} 个月`
  if (daysDiff <= 186) return `最近 ${Math.round(daysDiff / 30)} 个月`
  return `最近 ${Math.round(daysDiff / 365)} 年`
})

const chartTitle = computed(() => {
  switch (chartType.value) {
    case 'line':
      return '评分变化'
    case 'compare':
      return '页面比较'
    case 'overall':
      return '文档总体评分'
    default:
      return '评分变化'
  }
})

const chartDescription = computed(() => {
  switch (chartType.value) {
    case 'line':
      return '跟踪所选页面满意度的变化'
    case 'compare':
      return '比较各页面的反馈分布'
    case 'overall':
      return '文档总体满意度变化'
    default:
      return '跟踪所选页面满意度的变化'
  }
})

const chartIcon = computed(() => {
  switch (chartType.value) {
    case 'line':
      return 'i-lucide-trending-up'
    case 'compare':
      return 'i-lucide-bar-chart-4'
    case 'overall':
      return 'i-lucide-activity'
    default:
      return 'i-lucide-trending-up'
  }
})

const availableChartTypes = [
  { value: 'line' as const, label: '趋势', icon: 'i-lucide-trending-up' },
  { value: 'compare' as const, label: '比较', icon: 'i-lucide-bar-chart-4' },
  { value: 'overall' as const, label: '总览', icon: 'i-lucide-activity' }
]

function togglePageSelection(pagePath: string) {
  const index = selectedPagePaths.value.indexOf(pagePath)
  if (index > -1) {
    selectedPagePaths.value.splice(index, 1)
  } else {
    selectedPagePaths.value.push(pagePath)
  }
}

function selectTopPages(count: number) {
  if (!props.pageAnalytics) return

  const pages = props.pageAnalytics
    .filter(p => p && p.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, count)
  selectedPagePaths.value = pages.map(p => p.path)
}

function selectBestRatedPages(count: number) {
  if (!props.pageAnalytics) return

  const pages = props.pageAnalytics
    .filter(p => p && p.total > 0)
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, count)
  selectedPagePaths.value = pages.map(p => p.path)
}

function selectWorstPages(count: number) {
  if (!props.pageAnalytics) return

  const pages = props.pageAnalytics
    .filter(p => p && p.total > 0)
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, count)
  selectedPagePaths.value = pages.map(p => p.path)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <Motion
        :key="`header-${chartType}`"
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4, ease: 'easeInOut' }"
        class="flex items-center gap-3"
      >
        <UIcon :name="chartIcon" class="size-6 sm:size-5 text-primary shrink-0" />
        <div class="min-w-0">
          <h3 class="text-lg font-semibold truncate">
            {{ chartTitle }}
          </h3>
          <p class="text-sm text-muted">
            {{ chartDescription }}
          </p>
        </div>
      </Motion>

      <div class="flex items-center max-sm:flex-row-reverse max-sm:justify-end gap-2 flex-wrap">
        <AnimatePresence mode="wait">
          <Motion
            v-if="chartType !== 'overall'"
            :initial="{ opacity: 0, scale: 0.9 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.9 }"
            :transition="{ duration: 0.3 }"
          >
            <UChip :text="selectedPagePaths.length" size="3xl">
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-settings"
                @click="showPageSelector = true"
              />
            </UChip>
          </Motion>
        </AnimatePresence>

        <div class="flex items-center gap-1 border border-default rounded-lg p-1">
          <UButton
            v-for="type in availableChartTypes"
            :key="type.value"
            :color="chartType === type.value ? 'primary' : 'neutral'"
            :variant="chartType === type.value ? 'solid' : 'ghost'"
            size="sm"
            :icon="type.icon"
            :label="type.label"
            @click="chartType = type.value"
          />
        </div>
      </div>
    </div>

    <div class="relative rounded-xl overflow-hidden mb-8">
      <div class="dot-pattern h-[300px] -top-5 left-0 right-0" />

      <UChart
        :key="chartType"
        :type="chartType === 'compare' ? 'bar' : 'line'"
        :data="chartData"
        :index="chartType === 'compare' ? 'page' : 'day'"
        :categories="chartCategories"
        :stacked="chartType === 'compare'"
        :grid="chartType !== 'compare'"
        :format="yFormatter"
        :x-label="dateRangeLabel"
        :y-label="chartType === 'compare' ? '反馈数' : '评分（满分 4 分）'"
        :aria-label="chartTitle"
        class="relative"
      />
    </div>

    <div v-if="!hasValidData" class="text-center py-4">
      <p class="text-sm text-muted">
        暂无图表数据，收集到反馈后将在此显示实际趋势。
      </p>
    </div>

    <UModal v-model:open="showPageSelector" :ui="{ content: 'max-w-2xl' }">
      <template #content>
        <UCard>
          <template #header>
            <UButton
              size="sm"
              variant="ghost"
              color="neutral"
              icon="i-lucide-x"
              class="absolute top-2 right-2"
              @click="showPageSelector = false"
            />
            <div class="space-y-3">
              <h3 class="text-lg font-semibold">
                {{ chartType === 'line' ? '选择要跟踪的页面' : '选择要比较的页面' }}
              </h3>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-muted font-medium">快速选择：</span>
                <UButton
                  size="sm"
                  variant="soft"
                  color="neutral"
                  label="评分最高的 5 个"
                  @click="selectBestRatedPages(5)"
                />
                <UButton
                  size="sm"
                  variant="soft"
                  color="neutral"
                  label="最受欢迎的 5 个"
                  @click="selectTopPages(5)"
                />
                <UButton
                  size="sm"
                  variant="soft"
                  color="neutral"
                  label="评分最低的 5 个"
                  @click="selectWorstPages(5)"
                />
                <UButton
                  size="sm"
                  variant="soft"
                  color="neutral"
                  label="评分最低的 10 个"
                  @click="selectWorstPages(10)"
                />
              </div>
            </div>
          </template>

          <div class="mb-4">
            <UInput
              v-model="pageSearchQuery"
              placeholder="搜索页面……"
              icon="i-lucide-search"
              class="w-full"
              :ui="{ trailing: 'pe-1' }"
            >
              <template v-if="pageSearchQuery?.length" #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-circle-x"
                  aria-label="清除输入"
                  @click="pageSearchQuery = ''"
                />
              </template>
            </UInput>
          </div>

          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="page in availablePages"
              :key="page.path"
              class="flex items-center justify-between p-3 border border-default rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              :class="{ 'bg-primary/5 border-primary/20 hover:bg-primary/10': selectedPagePaths.includes(page.path) }"
              @click="togglePageSelection(page.path)"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <UCheckbox
                  :model-value="selectedPagePaths.includes(page.path)"
                  @update:model-value="togglePageSelection(page.path)"
                />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm truncate">
                    {{ page.title }}
                  </div>
                  <code class="text-xs text-muted truncate block">{{ page.path }}</code>
                </div>
              </div>
              <div class="flex items-center gap-2 sm:gap-4 text-sm shrink-0">
                <div class="text-center">
                  <div class="font-semibold">
                    {{ page.total }}
                  </div>
                  <div class="text-muted text-xs">
                    resp.
                  </div>
                </div>
                <div class="text-center">
                  <div class="font-semibold" :class="page.score >= 3.5 ? 'text-success' : page.score >= 3.0 ? 'text-warning' : 'text-error'">
                    {{ page.score.toFixed(1) }}/4
                  </div>
                  <div class="text-muted text-xs">
                    score
                  </div>
                </div>
              </div>
            </div>

            <div v-if="availablePages.length === 0" class="text-center py-8">
              <UIcon name="i-lucide-search-x" class="size-8 text-muted mx-auto mb-2" />
              <p class="text-sm text-muted">
                No pages found matching your search
              </p>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<style>
:root {
  --dot-pattern-color: #111827;
}

.dark {
  --dot-pattern-color: #9ca3af;
}

.dot-pattern {
  position: absolute;

  background-image: radial-gradient(var(--dot-pattern-color) 1px, transparent 1px);
  background-size: 7px 7px;
  background-position: -8.5px -8.5px;
  opacity: 20%;

  mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 1), transparent 75%);
}
</style>
