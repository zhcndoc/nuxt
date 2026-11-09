<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Module } from '#shared/types'

const props = withDefaults(
  defineProps<{
    module: Pick<Module, 'name' | 'npm' | 'description' | 'website' | 'repo'>
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    label?: string
  }>(),
  {
    size: 'md',
    label: '安装此模块'
  }
)

const { installCommand, copyInstall, copyPrompt, openCursor, openClaude, openVSCode } = useModuleInstallActions(() => props.module, 'install-group')

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: '复制安装命令',
      icon: 'i-lucide-terminal',
      onSelect: copyInstall
    },
    {
      label: '复制 AI 助手提示',
      icon: 'i-custom-ai',
      onSelect: copyPrompt
    }
  ],
  [
    {
      label: '在 Cursor 中打开',
      icon: 'i-simple-icons-cursor',
      onSelect: openCursor
    },
    {
      label: '在 Claude Code 中打开',
      icon: 'i-simple-icons-anthropic',
      onSelect: openClaude
    },
    {
      label: '在 VS Code 中打开',
      icon: 'i-simple-icons-visualstudiocode',
      onSelect: openVSCode
    }
  ]
])
</script>

<template>
  <UFieldGroup :size="size">
    <UTooltip :text="`复制：${installCommand}`" class="grow">
      <UButton
        color="neutral"
        variant="solid"
        icon="i-lucide-terminal"
        :label="label"
        block
        @click="copyInstall"
      />
    </UTooltip>

    <UDropdownMenu :items="items" :content="{ align: 'end' }">
      <UButton
        color="neutral"
        variant="solid"
        icon="i-lucide-chevron-down"
        aria-label="更多安装选项"
        class="shrink-0"
      />
    </UDropdownMenu>
  </UFieldGroup>
</template>
