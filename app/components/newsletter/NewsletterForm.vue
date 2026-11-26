<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const {
  label = '订阅新闻通讯',
  description = '获取 Nuxt 新版本、功能、指南和社区动态。',
  size = 'lg'
} = defineProps<{
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}>()

const toast = useToast()
const { track } = useAnalytics()

const loading = ref(false)

const state = reactive({
  email: ''
})

// The server validates the address too; this only catches typos before the request.
function validate(data: Partial<typeof state>): FormError[] {
  return /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(data.email ?? '') ? [] : [{ name: 'email', message: '请输入有效的电子邮件地址' }]
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  loading.value = true

  await $fetch('/api/newsletter/subscribe', {
    method: 'POST',
    body: {
      email: event.data.email
    }
  }).then(() => {
    track('Newsletter Subscription', { success: true })
    toast.add({ title: '等待确认订阅', description: '请查收邮件并确认订阅。', color: 'success' })
    state.email = ''
  }).catch((err) => {
    track('Newsletter Subscription', { success: false })
    const description = err.data?.message || '发生错误，请稍后重试。'
    toast.add({ title: '订阅失败', description, color: 'error' })
  })
  loading.value = false
}
</script>

<template>
  <UForm :validate="validate" :state="state" :validate-on="[]" class="block" @submit="onSubmit">
    <UFormField name="email" :label="label" :size="size" :description="description" :ui="{ label: 'font-semibold', container: label ? 'mt-3' : '' }">
      <UFieldGroup :size="size" class="max-w-sm w-full">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="you@domain.com"
          :aria-label="label ? undefined : '电子邮件地址'"
          required
          autocomplete="off"
          class="min-w-0 flex-1"
        />
        <UButton type="submit" color="neutral" :label="loading ? '订阅中' : '订阅'" :loading="loading" />
      </UFieldGroup>
    </UFormField>
  </UForm>
</template>
