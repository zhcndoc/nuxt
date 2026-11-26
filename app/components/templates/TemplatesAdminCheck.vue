<script setup lang="ts">
const props = defineProps<{ slug: string }>()
const emit = defineEmits<{ checked: [] }>()
const toast = useToast()
const busy = ref(false)
const phase = ref('等待检查')
const phases: Record<string, string> = {
  setup: '正在准备检查', install: '正在安装', build: '正在构建',
  start: '正在启动应用', snapshot: '正在保存预览'
}
const endpoint = computed(() => `/api/admin/templates/${props.slug}/check` as const)
const { pause, resume } = useIntervalFn(check, 3000, { immediate: false })
let requestId = 0
let appliedId = 0

async function check() {
  const id = ++requestId
  try {
    const current = await $fetch(endpoint.value)
    if (id <= appliedId) return
    appliedId = id
    const wasBusy = busy.value
    busy.value = current.state !== 'idle'
    phase.value = current.phase ? phases[current.phase] : '等待检查'
    if (busy.value) resume()
    else {
      pause()
      if (wasBusy) {
        if (current.status) toast.add({
          title: current.status === 'passed' ? '模板检查已通过' : '模板检查失败',
          description: current.status === 'failed' && current.step ? `在 ${current.step} 步骤失败。` : undefined,
          color: current.status === 'passed' ? 'success' : 'error'
        })
        emit('checked')
      }
    }
  } catch {
    if (id <= appliedId) return
    appliedId = id
    if (busy.value) resume()
    else pause()
    toast.add({ id: 'template-check-status', title: '无法读取检查状态。请重试。', color: 'error' })
  }
}

async function start() {
  appliedId = ++requestId
  pause()
  busy.value = true
  try {
    await $fetch(endpoint.value, { method: 'POST' })
    await check()
  } catch {
    busy.value = false
    toast.add({ title: '无法启动模板检查。请重试。', color: 'error' })
  }
}

onMounted(check)
</script>

<template>
  <div class="inline-flex" aria-live="polite">
    <UTooltip text="重新构建此模板并刷新在线预览">
      <UButton
        :label="busy ? phase : '重新检查'"
        icon="i-lucide-rotate-ccw"
        color="neutral"
        variant="ghost"
        :loading="busy"
        :aria-label="busy ? phase : '重新检查模板'"
        @click="start"
      />
    </UTooltip>
  </div>
</template>
