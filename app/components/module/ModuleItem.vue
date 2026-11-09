<script setup lang="ts">
import type { Module, ModuleProvider } from '#shared/types'
import { hasModuleDocs } from '#shared/utils/module-docs'

const emit = defineEmits<{
  add: [module: Module]
  remove: [module: Module]
  select: [module: Module, event: MouseEvent]
}>()

const props = withDefaults(
  defineProps<{
    module: Module
    /** Provider that matched the search, shown when the module itself did not */
    provider?: ModuleProvider
    showBadge?: boolean
    isAdded: boolean
    showAddButton?: boolean
    selectable?: boolean
    sortKey?: string
  }>(),
  {
    showBadge: true,
    showAddButton: true,
    selectable: false,
    sortKey: 'downloads'
  }
)

const { track } = useAnalytics()
const {
  copyInstall: copyInstallCommand,
  copyPrompt: copyAgentPrompt,
  openCursor: openPromptInCursor,
  openClaude: openPromptInClaudeCode,
  openVSCode: openPromptInVSCode
} = useModuleInstallActions(() => props.module, 'context-menu')

const publishedAgo = useTimeAgo(() => props.module.stats.publishedAt)
const createdAgo = useTimeAgo(() => props.module.stats.createdAt)

const relativeDate = computed(() =>
  props.sortKey === 'publishedAt' ? publishedAgo.value : createdAgo.value
)

const staticModuleDate = computed(() =>
  props.sortKey === 'publishedAt'
    ? formatDateByLocale('zh-CN', props.module.stats.publishedAt)
    : formatDateByLocale('zh-CN', props.module.stats.createdAt)
)

function toggleModule(m: Module) {
  const action = props.isAdded ? 'remove' : 'add'
  track('Module Toggled', { module: m.name, action })
  if (props.isAdded) {
    emit('remove', m)
  } else {
    emit('add', m)
  }
}

function handleCardClick(event: MouseEvent) {
  if (!props.selectable) return
  if (event.shiftKey || event.metaKey || event.ctrlKey) {
    event.preventDefault()
    emit('select', props.module, event)
  }
}

const items = computed(() => [
  [
    {
      label: props.isAdded ? '移除模块' : '添加模块',
      icon: props.isAdded ? 'i-lucide-minus' : 'i-lucide-plus',
      onSelect: () => toggleModule(props.module)
    },
    {
      label: '复制安装命令',
      icon: 'i-lucide-terminal',
      onSelect: copyInstallCommand
    },
    {
      label: '复制 AI 助手提示',
      icon: 'i-custom-ai',
      onSelect: copyAgentPrompt
    }
  ],
  [
    {
      label: '在 Cursor 中打开',
      icon: 'i-simple-icons-cursor',
      onSelect: openPromptInCursor
    },
    {
      label: '在 Claude Code 中打开',
      icon: 'i-simple-icons-anthropic',
      onSelect: openPromptInClaudeCode
    },
    {
      label: '在 VS Code 中打开',
      icon: 'i-simple-icons-visualstudiocode',
      onSelect: openPromptInVSCode
    }
  ],
  [
    {
      icon: 'i-lucide-book',
      label: '文档',
      // Hosted docs live on the module page, not on the registry `website`.
      ...(hasModuleDocs(props.module.name)
        ? { to: `/modules/${props.module.name}` }
        : { to: `${props.module.website}?utm_source=nuxt.com&utm_medium=aside-module&utm_campaign=nuxt.com`, target: '_blank' })
    },
    {
      label: '在 GitHub 上查看',
      icon: 'i-lucide-github',
      to: `https://github.com/${props.module.repo}`,
      target: '_blank'
    },
    {
      label: '在 npm 上查看',
      icon: 'i-lucide-package',
      to: `https://npmx.dev/package/${props.module.npm}`,
      target: '_blank'
    }
  ]
])
</script>

<template>
  <UContextMenu :items="items">
    <UPageCard
      :to="`/modules/${module.name}`"
      :title="module.npm"
      :description="module.description"
      class="group"
      variant="subtle"
      :ui="{
        root: isAdded ? 'ring-primary hover:ring-primary' : '',
        description: 'line-clamp-2 text-muted text-sm',
        container: 'flex flex-col',
        wrapper: 'flex flex-col min-h-0 items-start',
        body: 'flex-none',
        footer: 'w-full mt-auto pointer-events-auto pt-4 z-1'
      }"
      @click="handleCardClick"
    >
      <template #leading>
        <UAvatar
          :src="moduleImage(module.icon)"
          :icon="moduleIcon(module.category)"
          :alt="module.name"
          size="md"
          class="rounded-md bg-transparent"
        />
      </template>

      <UBadge
        v-show="showBadge && module.type === 'official'"
        class="shine absolute top-4 right-4 sm:top-6 sm:right-6"
        variant="subtle"
        color="primary"
        label="官方"
      />

      <UBadge
        v-show="showBadge && module.sponsor"
        class="shine absolute top-4 right-4 sm:top-6 sm:right-6"
        variant="subtle"
        color="important"
        label="赞助商"
      />

      <template #footer>
        <p v-if="provider" class="flex items-center gap-1.5 mb-3 text-sm text-muted">
          <!-- Keyed by name: Nuxt Icon's CSS mode writes a late-loading icon under the current name, so a reused instance can show the previous provider's icon. -->
          <UIcon :key="provider.icon" :name="provider.icon || 'i-lucide-plug'" class="size-4 shrink-0" />
          <span>支持 <span class="font-medium text-highlighted">{{ provider.label }}</span></span>
        </p>

        <USeparator type="dashed" class="mb-4" />

        <div class="flex items-center justify-between gap-3 -my-1 text-muted">
          <div class="flex items-center gap-3 flex-wrap">
            <UTooltip text="NPM 月下载量">
              <NuxtLink
                class="flex items-center gap-1 hover:text-highlighted"
                :to="`https://npmx.dev/package-stats/${module.npm}/v/${module.stats.version}?granularity=monthly`"
                target="_blank"
              >
                <UIcon name="i-lucide-circle-arrow-down" class="size-4 shrink-0" />
                <span class="text-sm font-medium whitespace-normal">{{ formatNumber(module.stats.downloads) }}</span>
              </NuxtLink>
            </UTooltip>

            <UTooltip text="GitHub 星标数">
              <NuxtLink
                class="flex items-center gap-1 hover:text-highlighted"
                :to="`https://github.com/${module.repo}`"
                target="_blank"
              >
                <UIcon name="i-lucide-star" class="size-4 shrink-0" />
                <span class="text-sm font-medium whitespace-normal">{{ formatNumber(module.stats.stars || 0) }}</span>
              </NuxtLink>
            </UTooltip>

            <template v-if="module.health">
              <UTooltip :text="`健康评分：${module.health.score}/100`">
                <NuxtLink
                  :to="`https://nuxt.care/?search=npm:${module.npm}`"
                  class="flex items-center gap-1 hover:text-highlighted"
                  target="_blank"
                >
                  <UIcon name="i-lucide-heart-pulse" class="size-4 shrink-0" :style="{ color: module.health.color }" />
                  <span class="text-sm font-medium whitespace-normal">
                    {{ module.health.score }}
                  </span>
                </NuxtLink>
              </UTooltip>
            </template>

            <UTooltip v-if="sortKey === 'publishedAt'" :text="`更新于 ${formatDateByLocale('zh-CN', module.stats.publishedAt)}`">
              <NuxtLink
                class="flex items-center gap-1 hover:text-highlighted"
                :to="`https://github.com/${module.repo}`"
                target="_blank"
              >
                <UIcon name="i-lucide-radio" class="size-4 shrink-0" />
                <span class="text-sm font-medium whitespace-normal">
                  <ClientOnly>
                    {{ relativeDate }}
                    <template #fallback>
                      {{ staticModuleDate }}
                    </template>
                  </ClientOnly>
                </span>
              </NuxtLink>
            </UTooltip>

            <UTooltip v-if="sortKey === 'createdAt'" :text="`创建于 ${formatDateByLocale('zh-CN', module.stats.createdAt)}`">
              <NuxtLink
                class="flex items-center gap-1 hover:text-highlighted"
                :to="`https://github.com/${module.repo}`"
                target="_blank"
              >
                <UIcon name="i-lucide-package" class="size-4 shrink-0" />
                <span class="text-sm font-medium whitespace-normal">
                  <ClientOnly>
                    {{ relativeDate }}
                    <template #fallback>
                      {{ staticModuleDate }}
                    </template>
                  </ClientOnly>
                </span>
              </NuxtLink>
            </UTooltip>
          </div>

          <div class="flex items-center gap-2">
            <UTooltip v-if="showAddButton" :text="isAdded ? '移除模块' : '添加模块'">
              <UButton
                :icon="isAdded ? 'i-lucide-check' : 'i-lucide-plus'"
                color="neutral"
                size="xs"
                variant="outline"
                @click="toggleModule(module)"
              >
                <span class="sr-only">{{ isAdded ? '移除模块' : '添加模块' }}</span>
              </UButton>
            </UTooltip>
            <UTooltip text="复制安装命令">
              <UButton
                icon="i-lucide-terminal"
                color="neutral"
                size="xs"
                variant="outline"
                @click="copyInstallCommand"
              >
                <span class="sr-only">复制用于安装 {{ module.name }} 的命令</span>
              </UButton>
            </UTooltip>
          </div>
        </div>
      </template>
    </UPageCard>
  </UContextMenu>
</template>

<style lang="postcss" scoped>
.shine {
  text-decoration: none;
  display: inline-block;
  mask-image: linear-gradient(-75deg, rgba(255,255,255,.8) 30%, #fff 50%, rgba(255,255,255,.8) 70%);
  mask-size: 200%;
  animation: shine 2s linear infinite;
}

@keyframes shine {
  from { -webkit-mask-position: 150%; }
  to { -webkit-mask-position: -50%; }
}
</style>
