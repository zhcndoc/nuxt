<script setup lang="ts">
import type { NuxterMe } from '#shared/types'
import { NUXTERS_ME_CARD_CLASS } from '~/utils/nuxters-me-card'
import { NUXTERS_HACKATHONS } from '#shared/utils/nuxters'

// The session loads client-side (`auth.loadStrategy`): until `ready`, the visitor may be signed in.
const { loggedIn, ready } = useUserSession()
const route = useRoute()
const toast = useToast()
const { format } = new Intl.NumberFormat('en-US')

// Not awaited: the card mounts after hydration (ClientOnly), an await would render nothing until the
// request ends. The skeleton shows instead, at the same height.
const { data: me, status } = useFetch<NuxterMe>('/api/me/nuxter', {
  key: 'nuxters-me',
  server: false,
  immediate: loggedIn.value,
  watch: [loggedIn]
})

const lastYear = computed(() => me.value?.nuxter?.periods.find(row => row.period === '12m'))

const unlocks = computed(() => {
  const nuxter = me.value?.nuxter
  return [
    { label: '已合并的 PR', value: nuxter?.mergedPullRequests.all ?? 0 },
    { label: '有帮助的 Issue', value: nuxter?.helpfulIssues ?? 0, hint: '已完成，或获得 3 次以上回应，或有 5 条以上评论' },
    { label: '有帮助的评论', value: nuxter?.helpfulComments ?? 0, hint: '获得 3 次以上回应' },
    { label: '翻译', value: (nuxter?.translations?.edited ?? 0) + (nuxter?.translations?.verified ?? 0), hint: '编辑或校验过的文档片段' }
  ]
})

const roleLabels: Record<string, string> = {
  nuxter: 'Nuxter',
  moduleAuthor: '模块作者',
  ...Object.fromEntries(NUXTERS_HACKATHONS.map(hackathon => [hackathon.id, hackathon.name]))
}

const badges = computed(() => {
  const badges = me.value?.badges
  if (!badges) return []
  return [
    ...[
      ...(badges.nuxter ? ['nuxter'] : []),
      ...(badges.moduleAuthor ? ['moduleAuthor'] : []),
      ...badges.hackathons
    ].map(key => roleLabels[key] ?? key),
    ...(badges.translator.length ? [`翻译贡献者（${badges.translator.join('、')}）`] : [])
  ]
})

onMounted(() => {
  if (route.query.discord === 'linked') {
    toast.add({ title: '已关联 Discord', description: '您的身份组现已同步到 Nuxt Discord 服务器。', icon: 'i-simple-icons-discord', color: 'success' })
  } else if (route.query.discord === 'error') {
    toast.add({ title: '关联 Discord 失败', description: '请重试。', icon: 'i-simple-icons-discord', color: 'error' })
  }
})
</script>

<template>
  <!-- Loading shows NuxtersMeCardSkeleton: same card and minimum height, the hero does not move -->
  <NuxtersMeCardSkeleton v-if="!ready || (loggedIn && (status !== 'success' || !me))" />
  <!-- A flex column (the container is a grid from lg): the signed-out content centers in the reserved height -->
  <UPageCard v-else variant="subtle" :class="NUXTERS_ME_CARD_CLASS" :ui="{ container: 'flex flex-col lg:flex' }">
    <div v-if="!loggedIn || !me" class="flex flex-col items-center gap-4 my-auto text-center">
      <UIcon name="i-simple-icons-github" class="size-8" />
      <p class="text-lg font-medium text-highlighted">
        查看您的贡献
      </p>
      <p class="text-muted max-w-sm -mt-2">
        使用 GitHub 登录，查看您的分数、分享 Nuxter 个人资料并解锁徽章。
      </p>
      <UButton
        label="使用 GitHub 登录"
        color="neutral"
        icon="i-simple-icons-github"
        to="/api/auth/github?redirect=/nuxters"
        external
      />
    </div>

    <div v-else class="flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <NuxtImg
          :src="`/gh_avatar/${me.username}`"
          provider="ipx"
          densities="x1 x2"
          width="64"
          height="64"
          format="auto"
          :alt="me.username"
          class="size-16 rounded-full bg-muted"
        />
        <div class="flex-1 min-w-0">
          <p class="text-lg font-semibold text-highlighted truncate">
            {{ me.username }}
          </p>
          <p v-if="me.nuxter" class="flex items-center gap-1 text-muted">
            <span class="tabular-nums">#{{ format(me.nuxter.rank) }}</span>
            <span>·</span>
            <span class="tabular-nums">{{ format(me.nuxter.score) }} 分</span>
            <NuxtersScoreBreakdown :nuxter="me.nuxter" />
          </p>
          <p v-else class="text-muted">
            暂无贡献记录。
          </p>
          <p v-if="lastYear" class="text-sm text-muted">
            最近 12 个月：<span class="tabular-nums">#{{ format(lastYear.rank) }}</span>
          </p>
        </div>
        <UButton
          v-if="me.nuxter"
          :to="`/nuxters/${me.nuxter.username}`"
          label="我的个人资料"
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="outline"
        />
      </div>

      <ul class="flex flex-col gap-2">
        <li v-for="item in unlocks" :key="item.label" class="flex items-center gap-2">
          <UIcon
            :name="item.value > 0 ? 'i-lucide-circle-check' : 'i-lucide-circle'"
            class="size-5 shrink-0"
            :class="item.value > 0 ? 'text-primary' : 'text-dimmed'"
          />
          <span><span class="font-medium text-highlighted tabular-nums">{{ format(item.value) }}</span> {{ item.label }}</span>
          <UTooltip v-if="item.hint" :text="item.hint">
            <UIcon name="i-lucide-info" class="size-4 text-dimmed" />
          </UTooltip>
        </li>
      </ul>

      <div class="flex flex-wrap items-center gap-2">
        <template v-if="badges.length">
          <UBadge
            v-for="badge in badges"
            :key="badge"
            :label="badge"
            icon="i-lucide-award"
            variant="subtle"
          />
        </template>
        <p v-else class="text-sm text-muted">
          合并一个 PR、提交有帮助的 Issue 或评论，或编辑、校验一段翻译，即可解锁 Nuxter 徽章。
        </p>
      </div>

      <!-- One row of actions, unlocked with a badge: the card keeps its height with or without Discord.
           Sharing is the all-time profile: the card does not follow the leaderboard period. -->
      <div v-if="me.nuxter && badges.length" class="flex flex-wrap items-center gap-2 pt-4 border-t border-default">
        <UTooltip v-if="me.discord.enabled" :text="me.discord.username ? `已关联为 ${me.discord.username}` : '在 Nuxt Discord 服务器领取身份组'">
          <UButton
            :label="me.discord.username ? '同步 Discord 身份组' : '解锁 Discord 身份组'"
            icon="i-simple-icons-discord"
            color="neutral"
            :variant="me.discord.username ? 'soft' : 'solid'"
            size="sm"
            to="/api/auth/discord"
            external
          />
        </UTooltip>
        <NuxtersShare :username="me.nuxter.username" :periods="me.nuxter.periods.map(row => row.period)" class="contents" />
      </div>
    </div>
  </UPageCard>
</template>
