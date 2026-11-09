<script setup lang="ts">
import type { Template, TemplateHealth } from '#shared/types'
import type { LivePreviewStatus } from './TemplatesLivePreview.vue'

const props = defineProps<{
  template: Template
  health?: TemplateHealth
}>()

const live = ref(false)
const liveUrl = ref<string>()
const status = ref<LivePreviewStatus>()
const readyIn = ref<number>()
const device = ref<'desktop' | 'mobile'>('desktop')

const { preview: livePreview, reloadRequest } = useLivePreview()
const { track } = useAnalytics()

const image = computed(() => templateImage(props.template))
const canGoLive = computed(() => canLivePreview(props.template) && !!props.health?.check?.live)
const booting = computed(() => live.value && status.value !== 'live')
const livePage = computed(() => liveUrl.value && `${liveUrl.value}${livePreview.value?.path ?? ''}`)
const address = computed(() => (live.value ? livePage.value || '正在启动预览……' : props.template.demo || templateRepoUrl(props.template))?.replace(/^https?:\/\//, '').replace(/\/$/, ''))
const openUrl = computed(() => live.value ? livePage.value : props.template.demo)

const startedAt = ref(0)
const now = useNow({ interval: 1000 })
const remaining = computed(() => Math.max(0, PREVIEW_TIMEOUT_MS - (now.value.getTime() - startedAt.value)))
const countdown = computed(() => {
  const seconds = Math.ceil(remaining.value / 1000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
})
watch(remaining, value => live.value && value === 0 && stop())

function start() {
  track('Template Action', { template: props.template.name, action: 'Try Live Preview' })
  startedAt.value = Date.now()
  live.value = true
}

function onStatus(value: LivePreviewStatus, ms?: number) {
  // "Try Again" boots a new sandbox, with a new timeout.
  if (value === 'booting') startedAt.value = Date.now()
  status.value = value
  if (ms) readyIn.value = ms
}

function stop() {
  live.value = false
  liveUrl.value = undefined
  status.value = undefined
  readyIn.value = undefined
  device.value = 'desktop'
}
</script>

<template>
  <div class="rounded-xl bg-elevated/40 ring ring-default p-1 shadow-xs">
    <div class="h-9 ps-2.5 pe-1 grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-3">
      <div class="min-w-0 flex items-center gap-2 text-xs">
        <template v-if="live">
          <span class="relative flex size-2 shrink-0">
            <span v-if="status === 'live'" class="absolute inset-0 rounded-full bg-success/60 motion-safe:animate-ping [animation-iteration-count:2]" />
            <span
              class="relative size-2 rounded-full transition-colors duration-300"
              :class="status === 'live' ? 'bg-success' : status === 'failed' ? 'bg-error' : 'bg-warning motion-safe:animate-pulse'"
            />
          </span>
          <span class="font-medium text-highlighted">{{ status === 'live' ? '运行中' : status === 'failed' ? '已停止' : '正在启动' }}</span>
          <UTooltip
            v-if="status === 'live'"
            :text="`${readyIn ? `${(readyIn / 1000).toFixed(1)} 秒后就绪。` : ''}预览将在 ${PREVIEW_TIMEOUT_MS / 60_000} 分钟后自动关闭。`"
            :ui="{ content: 'max-w-xs h-auto py-1.5', text: 'whitespace-normal text-pretty' }"
          >
            <span class="hidden sm:inline font-mono text-muted tabular-nums cursor-default" :class="remaining < 60_000 && 'text-warning'">剩余 {{ countdown }}</span>
          </UTooltip>
        </template>
      </div>

      <div class="min-w-0 flex items-center justify-center gap-1.5 text-xs text-muted">
        <UIcon v-if="!live" name="i-lucide-lock" class="size-3 shrink-0 text-dimmed" />
        <span class="truncate font-mono">{{ address }}</span>
      </div>

      <div class="flex items-center justify-end gap-0.5">
        <template v-if="live">
          <UTooltip v-if="status === 'live'" text="重新加载">
            <UButton
              icon="i-lucide-rotate-cw"
              aria-label="重新加载预览"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="reloadRequest++"
            />
          </UTooltip>
          <UTooltip v-for="item in ([{ value: 'desktop', icon: 'i-lucide-monitor', label: '桌面' }, { value: 'mobile', icon: 'i-lucide-smartphone', label: '移动端' }] as const)" :key="item.value" :text="item.label">
            <UButton
              :icon="item.icon"
              :aria-label="item.label"
              :aria-pressed="device === item.value"
              color="neutral"
              :variant="device === item.value ? 'soft' : 'ghost'"
              size="xs"
              class="hidden sm:inline-flex"
              @click="device = item.value"
            />
          </UTooltip>
          <button
            type="button"
            aria-label="停止在线预览"
            class="group ms-1 me-0.5 h-6 ps-2 pe-2.5 flex items-center gap-1.5 rounded-full bg-error/10 ring ring-error/25 text-xs font-medium text-error transition-[background-color,scale] duration-150 ease-snappy hover:bg-error/15 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-error"
            @click="stop"
          >
            <span class="size-2 rounded-[2px] bg-current transition-transform duration-150 ease-snappy group-hover:scale-110" />
            停止
          </button>
        </template>
        <UTooltip v-if="openUrl" text="在新标签页中打开">
          <UButton
            :to="openUrl"
            target="_blank"
            icon="i-lucide-arrow-up-right"
            aria-label="在新标签页中打开"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="!live && track('Template Action', { template: template.name, action: 'Open Demo' })"
          />
        </UTooltip>
      </div>
    </div>

    <div class="relative aspect-video overflow-hidden rounded-lg ring ring-default bg-default">
      <NuxtImg
        v-if="image"
        :src="image"
        :alt="`${template.name} 截图`"
        class="absolute inset-0 size-full object-cover object-top transition-[opacity,filter,scale] duration-500 ease-snappy"
        :class="[
          booting && 'blur-md scale-[1.03] opacity-60',
          live && status === 'live' && device === 'mobile' && 'opacity-0'
        ]"
        width="1600"
        height="900"
        format="webp"
      />
      <div
        v-else
        class="absolute inset-0 flex items-center justify-center bg-[radial-gradient(var(--ui-border)_1px,transparent_1px)] bg-[length:16px_16px] transition-opacity duration-300"
        :class="live && 'opacity-40'"
      >
        <UIcon v-if="!canGoLive" :name="template.icon || 'i-lucide-app-window'" class="size-10 text-dimmed" />
      </div>

      <Transition leave-active-class="transition-opacity duration-200 ease-snappy" leave-to-class="opacity-0">
        <div
          v-if="live"
          class="absolute inset-y-0 left-1/2 -translate-x-1/2 transition-[width] duration-300 ease-snappy"
          :class="device === 'mobile' ? 'w-[390px] max-w-full border-x border-default' : 'w-full'"
        >
          <TemplatesLivePreview :template="template" @url="liveUrl = $event" @status="onStatus" />
        </div>
      </Transition>

      <Transition
        enter-from-class="opacity-0 translate-y-2"
        enter-active-class="transition-[opacity,translate] duration-300 ease-snappy"
        leave-active-class="transition-[opacity,translate] duration-150 ease-snappy"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div
          v-if="canGoLive && !live"
          class="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex justify-center"
          :class="image ? 'pt-24 bg-linear-to-t from-black/35 to-transparent' : 'top-0 items-center'"
        >
          <div class="flex items-center gap-3 rounded-full bg-default/80 backdrop-blur-xl ring ring-default shadow-lg shadow-black/10 p-1 sm:pe-4">
            <UButton
              label="在线试用"
              icon="i-lucide-play"
              class="rounded-full px-3.5 transition-transform duration-150 ease-snappy active:scale-[0.97]"
              @click="start"
            />
            <span class="hidden sm:inline text-xs text-muted">直接在浏览器中体验真实的 Nuxt 应用</span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
