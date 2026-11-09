<script setup lang="ts">
import type { NuxtersPeriod } from '#shared/types'
import { nuxtersPeriodLabel, nuxtersPeriodPhrase, sortNuxtersPeriods } from '#shared/utils/nuxters'

const props = defineProps<{
  username: string
  /** The link and the card share the period on screen (all time by default). */
  period?: NuxtersPeriod
  /** The periods the user contributed in: the README card can show any of them. */
  periods?: NuxtersPeriod[]
}>()

const site = useSiteConfig()
const { copy } = useClipboard()

const queryOf = (period?: NuxtersPeriod) => !period || period === 'all' ? '' : `?period=${period}`
const profileUrl = computed(() => `${site.url}/nuxters/${props.username}${queryOf(props.period)}`)

// The card renders on demand (a few seconds for a new period): its background and a loader meanwhile.
const cardState = ref<'loading' | 'loaded' | 'error'>('loading')
// The README card starts on the period on screen, and can be switched in the modal.
const open = ref(false)
const cardPeriod = ref<NuxtersPeriod>(props.period ?? 'all')
watch(open, (value) => {
  if (!value) return
  cardPeriod.value = props.period ?? 'all'
  cardState.value = 'loading'
})
const periodItems = computed(() => sortNuxtersPeriods(['all', ...(props.periods ?? [])])
  .map(value => ({ label: nuxtersPeriodLabel(value), value })))
const cardQuery = computed(() => queryOf(cardPeriod.value))
const cardProfileUrl = computed(() => `${site.url}/nuxters/${props.username}${cardQuery.value}`)
const cardUrl = computed(() => `${site.url}/nuxters/${props.username}/card.png${cardQuery.value}`)
const alt = computed(() => `${props.username} 的 Nuxter 个人资料${cardQuery.value ? `（${nuxtersPeriodPhrase(cardPeriod.value)}）` : ''}`)
watch(cardUrl, () => {
  cardState.value = 'loading'
})
const markdown = computed(() => `[![${alt.value}](${cardUrl.value})](${cardProfileUrl.value})`)
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <UButton
      label="复制个人资料链接"
      icon="i-lucide-link"
      color="neutral"
      variant="soft"
      size="sm"
      @click="copy(profileUrl, { title: '个人资料链接已复制', icon: 'i-lucide-check' })"
    />

    <UModal
      v-model:open="open"
      title="将 Nuxter 卡片添加到 GitHub"
      description="将此 Markdown 粘贴到 GitHub 个人资料 README 中。卡片每日更新。"
      :ui="{ content: 'sm:max-w-2xl' }"
    >
      <UButton label="添加到 README" icon="i-lucide-id-card" color="neutral" variant="soft" size="sm" />

      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField v-if="periodItems.length > 1" label="统计周期" orientation="horizontal" :ui="{ container: 'w-44' }">
            <USelect v-model="cardPeriod" :items="periodItems" class="w-full" />
          </UFormField>
          <!-- The card's own background (OgImage/Nuxter.takumi.vue) while it loads, in both color modes -->
          <div class="relative w-full aspect-[1200/630] rounded-md ring ring-default bg-neutral-950 overflow-hidden">
            <!-- Keyed by period: the previous card does not stay on screen while the new one loads -->
            <img
              :key="cardUrl"
              :src="cardUrl"
              :alt="`${username} 的 Nuxter 卡片`"
              width="1200"
              height="630"
              class="size-full transition-opacity duration-300"
              :class="cardState === 'loaded' ? 'opacity-100' : 'opacity-0'"
              @load="cardState = 'loaded'"
              @error="cardState = 'error'"
            >
            <div v-if="cardState !== 'loaded'" class="absolute inset-0 flex items-center justify-center gap-2 text-sm text-neutral-400" role="status">
              <template v-if="cardState === 'loading'">
                <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin" />
                <span class="sr-only">正在加载卡片</span>
              </template>
              <template v-else>
                <UIcon name="i-lucide-image-off" class="size-5" />
                无法加载卡片
              </template>
            </div>
          </div>
          <UTextarea :model-value="markdown" readonly :rows="3" class="font-mono" :ui="{ base: 'text-xs' }" />
          <div class="flex flex-wrap items-center justify-between gap-2">
            <ULink
              to="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme"
              target="_blank"
              class="text-sm"
            >
              如何设置个人资料 README
            </ULink>
            <UButton
              label="复制 Markdown"
              icon="i-lucide-copy"
              @click="copy(markdown, { title: 'Markdown 已复制', icon: 'i-lucide-check' })"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
