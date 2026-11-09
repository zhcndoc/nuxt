import { LazyChatModalConfirm } from '#components'

export function useDeleteAccount() {
  const overlay = useOverlay()
  const toast = useToast()
  const { fetch: refreshSession } = useUserSession()

  const confirmModal = overlay.create(LazyChatModalConfirm, {
    props: {
      title: '删除账户',
      description: '这会永久删除您的 Nuxt 中文文档账户和与 Nuxi 的对话，且无法撤销。',
      color: 'error',
      confirmLabel: '删除账户'
    }
  })

  return async function deleteAccount() {
    if (!(await confirmModal.open().result)) return

    try {
      await $fetch('/api/account', { method: 'DELETE' })
    } catch {
      toast.add({
        description: '删除账户失败。',
        icon: 'i-lucide-alert-circle',
        color: 'error'
      })
      return
    }

    await refreshSession()
    toast.add({
      title: '账户已删除',
      icon: 'i-lucide-trash'
    })
    await navigateTo('/')
  }
}
