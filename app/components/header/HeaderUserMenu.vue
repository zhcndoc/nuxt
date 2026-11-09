<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { user, clear } = useUserSession()
const colorMode = useColorMode()
const route = useRoute()
const deleteAccount = useDeleteAccount()

// Middleware that require a session, see app/middleware/
const AUTH_MIDDLEWARE = ['auth', 'admin']

async function logout() {
  await clear()

  // Stay on the current page unless it requires a session
  const middleware = [route.meta.middleware].flat()
  if (middleware.some(m => typeof m === 'string' && AUTH_MIDDLEWARE.includes(m))) {
    await navigateTo({ path: '/login', query: { redirect: route.fullPath } })
  }
}

const items = computed<DropdownMenuItem[][]>(() => {
  const groups: DropdownMenuItem[][] = [
    [{
      type: 'label',
      label: user.value?.name || user.value?.username || '账户',
      avatar: {
        src: user.value?.avatar,
        alt: user.value?.username
      }
    }]
  ]

  const accountItems: DropdownMenuItem[] = [{
    label: '与 Nuxi 的对话',
    icon: 'i-lucide-message-circle',
    to: '/dashboard/chat'
  }, {
    label: '我的 Nuxter 个人资料',
    icon: 'i-lucide-award',
    to: '/nuxters'
  }]
  if (user.value?.role === 'admin') {
    accountItems.push({
      label: '数据分析',
      icon: 'i-lucide-chart-bar',
      to: '/admin/analytics'
    })
  }
  groups.push(accountItems)

  groups.push([{
    label: '外观',
    icon: 'i-lucide-sun-moon',
    children: [[
      {
        label: '浅色',
        icon: 'i-lucide-sun',
        onSelect: () => { colorMode.preference = 'light' },
        checked: colorMode.value === 'light'
      },
      {
        label: '深色',
        icon: 'i-lucide-moon',
        onSelect: () => { colorMode.preference = 'dark' },
        checked: colorMode.value === 'dark'
      }
    ]]
  }])

  groups.push([{
    label: '退出登录',
    icon: 'i-lucide-log-out',
    onSelect: logout
  }, {
    label: '删除账户',
    icon: 'i-lucide-user-x',
    color: 'error',
    onSelect: deleteAccount
  }])

  return groups
})
</script>

<template>
  <UDropdownMenu
    v-if="user"
    :items="items"
    :content="{ align: 'end' }"
  >
    <UButton
      :avatar="{ src: user.avatar, alt: user.username }"
      color="neutral"
      variant="ghost"
      square
      :aria-label="user.username"
    />
  </UDropdownMenu>
</template>
