<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const { copy, copied } = useClipboard()
const site = useSiteConfig()
const { track } = useAnalytics()
const isCopying = ref(false)

const mdPath = computed(() => `${site.url}/raw${route.path}.md`)

const items = [
  [{
    label: '复制 Markdown 链接',
    icon: 'i-lucide-link',
    onSelect() {
      track('Page Action', { action: 'Copy Markdown Link' })
      copy(mdPath.value)
      toast.add({
        title: '已复制到剪贴板',
        icon: 'i-lucide-check-circle'
      })
    }
  },
  {
    label: '以 Markdown 查看',
    icon: 'i-simple-icons:markdown',
    target: '_blank',
    to: `/raw${route.path}.md`,
    onSelect: () => track('Page Action', { action: 'View as Markdown' })
  },
  {
    label: '在 ChatGPT 中打开',
    icon: 'i-simple-icons:openai',
    target: '_blank',
    to: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(`请阅读 ${mdPath.value}，我将针对其内容提问。`)}`,
    onSelect: () => track('Page Action', { action: 'Open in ChatGPT' })
  },
  {
    label: '在 Claude 中打开',
    icon: 'i-simple-icons:anthropic',
    target: '_blank',
    to: `https://claude.ai/new?q=${encodeURIComponent(`请阅读 ${mdPath.value}，我将针对其内容提问。`)}`,
    onSelect: () => track('Page Action', { action: 'Open in Claude' })
  }]
]

async function copyPage() {
  track('Page Action', { action: 'Copy Page' })
  isCopying.value = true
  copy(await $fetch<string>(`/raw${route.path}.md`))
  isCopying.value = false
}
</script>

<template>
  <UFieldGroup>
    <UButton
      label="复制页面"
      :icon="copied ? 'i-lucide-clipboard-check' : 'i-lucide-clipboard'"
      color="neutral"
      variant="soft"
      size="sm"
      :loading="isCopying"
      :ui="{
        leadingIcon: 'size-3.5'
      }"
      @click="copyPage"
    />
    <UDropdownMenu
      :items="items"
      size="sm"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8
      }"
      :ui="{
        content: 'w-48'
      }"
    >
      <UButton
        icon="i-lucide-chevron-down"
        size="sm"
        color="neutral"
        variant="soft"
        class="border-l border-muted"
        aria-label="打开复制选项"
        :ui="{
          leadingIcon: 'size-3.5'
        }"
      />
    </UDropdownMenu>
  </UFieldGroup>
</template>
