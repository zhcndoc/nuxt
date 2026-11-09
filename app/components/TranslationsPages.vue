<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
import { l10nPagesStatusPath, localisePath, type L10nLocale, type L10nPageStatus } from '#shared/utils/l10n'

const props = defineProps<{ locale: L10nLocale }>()

const ULink = resolveComponent('ULink')

const PAGE_SIZE = 25

const { data: pages, status } = useLazyFetch<L10nPageStatus[]>(() => l10nPagesStatusPath(props.locale), { server: false, default: () => [] })

const query = ref('')
const sort = ref<'pending' | 'reviewed' | 'path'>('pending')
const page = ref(1)

const filtered = computed(() => {
  const needle = query.value.trim().toLowerCase()
  const list = needle ? pages.value.filter(item => item.path.toLowerCase().includes(needle)) : [...pages.value]
  if (sort.value === 'pending') list.sort((a, b) => b.pending - a.pending || a.path.localeCompare(b.path))
  if (sort.value === 'reviewed') list.sort((a, b) => b.reviewed - a.reviewed || a.path.localeCompare(b.path))
  return list
})
const visible = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

watch([query, sort], () => {
  page.value = 1
})

const percent = (value: number) => `${Math.round(value * 100)}%`
const numeric = { th: 'text-right', td: 'text-right tabular-nums' }

const columns: TableColumn<L10nPageStatus>[] = [
  {
    accessorKey: 'path',
    header: '页面',
    cell: ({ row }) => h(ULink, { to: localisePath(props.locale, row.original.path), external: true, class: 'text-highlighted hover:underline' }, () => row.original.path)
  },
  { accessorKey: 'words', header: '词数', meta: { class: numeric } },
  { accessorKey: 'reviewed', header: '已审核', cell: ({ row }) => percent(row.original.reviewed), meta: { class: numeric } },
  {
    id: 'machine',
    header: '机器翻译',
    cell: ({ row }) => row.original.words ? percent((row.original.byStatus.machine ?? 0) / row.original.words) : '',
    meta: { class: numeric }
  },
  { accessorKey: 'pending', header: '待审核', meta: { class: numeric } },
  { accessorKey: 'indexable', header: '可索引', cell: ({ row }) => row.original.indexable ? '是' : '否' }
]
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-end gap-2">
      <UFormField label="筛选页面" class="w-full md:w-80">
        <UInput v-model="query" icon="i-lucide-search" type="search" class="w-full" />
      </UFormField>
      <UFormField label="排序" class="w-48">
        <USelect
          v-model="sort"
          :items="[{ label: '待审核最多优先', value: 'pending' }, { label: '已审核最多优先', value: 'reviewed' }, { label: '按路径排序', value: 'path' }]"
          class="w-full"
        />
      </UFormField>
      <p class="ms-auto text-sm text-muted" role="status">
        <template v-if="status === 'success'">
          共 {{ pages.length }} 个页面，当前显示 {{ filtered.length }} 个
        </template>
      </p>
    </div>

    <UTable
      :data="visible"
      :columns="columns"
      :loading="status === 'pending' || status === 'idle'"
      :empty="status === 'error' ? '无法加载页面。' : '没有符合筛选条件的页面。'"
      caption="各翻译页面的审核状态"
      :ui="{ caption: 'sr-only', td: 'py-1.5' }"
    />

    <UPagination v-if="filtered.length > PAGE_SIZE" v-model:page="page" :total="filtered.length" :items-per-page="PAGE_SIZE" />
  </div>
</template>
