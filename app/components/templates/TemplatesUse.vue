<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Template, TemplateHealth } from '#shared/types'

const props = defineProps<{
  template: Template
  health?: TemplateHealth
}>()

const { track } = useAnalytics()

const deployItems = computed<DropdownMenuItem[][]>(() => {
  const providers = DEPLOY_PROVIDERS.flatMap((provider) => {
    const url = buildDeployUrl(props.template, provider.value)
    return url
      ? [{
          label: provider.label,
          icon: provider.icon,
          to: url,
          target: '_blank',
          onSelect: () => track('Template Action', { template: props.template.name, action: `Deploy ${provider.label}` })
        }]
      : []
  })
  return providers.length ? [providers, [{ label: '其他平台', icon: 'i-lucide-server', to: '/deploy', onSelect: () => track('Template Action', { template: props.template.name, action: 'Deploy Other' }) }]] : []
})
const editors = computed<DropdownMenuItem[]>(() => {
  const stackBlitz = isStarter(props.template) ? `/new/s/${props.template.slug}` : buildStackBlitzUrl(props.template)
  const codeSandbox = isStarter(props.template) ? `/new/c/${props.template.slug}` : buildCodeSandboxUrl(props.template)
  return [
    stackBlitz && { label: '在 StackBlitz 中打开', icon: 'i-simple-icons-stackblitz', to: stackBlitz, target: '_blank', onSelect: () => track('Template Action', { template: props.template.name, action: 'Open StackBlitz' }) },
    codeSandbox && { label: '在 CodeSandbox 中打开', icon: 'i-simple-icons-codesandbox', to: codeSandbox, target: '_blank', onSelect: () => track('Template Action', { template: props.template.name, action: 'Open CodeSandbox' }) }
  ].filter(item => !!item)
})
</script>

<template>
  <div v-if="isScaffoldable(template)" class="flex flex-col gap-2">
    <div class="flex flex-col sm:flex-row gap-2">
      <TemplatesCommand :template="template" :health="health" class="flex-1" />
      <div class="flex gap-2">
        <UDropdownMenu v-if="deployItems.length" :items="deployItems" :content="{ align: 'end' }">
          <UButton
            label="部署"
            icon="i-lucide-rocket"
            trailing-icon="i-lucide-chevron-down"
            color="neutral"
            variant="subtle"
            class="h-10 flex-1 sm:flex-none justify-center ring-default"
          />
        </UDropdownMenu>
        <UDropdownMenu v-if="editors.length" :items="editors" :content="{ align: 'end' }">
          <UButton
            icon="i-lucide-ellipsis"
            color="neutral"
            variant="subtle"
            class="h-10 w-10 justify-center ring-default"
            aria-label="更多启动方式"
          />
        </UDropdownMenu>
      </div>
    </div>
    <p v-if="template.deploy?.env?.length" class="text-xs text-muted">
      运行需要 {{ template.deploy.env.length }} 个环境变量，部署时托管平台会要求您填写。
    </p>
  </div>

  <div v-else-if="template.purchase" class="flex flex-col sm:flex-row sm:items-center gap-3">
    <UButton
      :to="template.purchase"
      target="_blank"
      label="获取此模板"
      trailing-icon="i-lucide-arrow-up-right"
      class="h-10 self-start"
      @click="track('Template Action', { template: template.name, action: 'Purchase' })"
    />
    <p class="text-sm text-muted text-pretty">
      由作者在其网站上出售。Nuxt 不会审核或检查付费模板。
    </p>
  </div>
</template>
