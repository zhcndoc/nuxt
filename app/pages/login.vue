<script setup lang="ts">
import { motion } from 'motion-v'

definePageMeta({
  layout: false,
  middleware: 'guest',
  colorMode: 'dark'
})

const route = useRoute()

const redirect = computed(() => safeRedirectPath(route.query.redirect))

const githubHref = computed(() => {
  if (!redirect.value) return '/api/auth/github'
  return `/api/auth/github?redirect=${encodeURIComponent(redirect.value)}`
})

useSeoMeta({
  title: '登录',
  description: '使用 GitHub 账号登录 Nuxt 中文文档，访问聊天记录等功能。'
})

const features = [
  {
    icon: 'i-lucide-history',
    title: '聊天记录',
    description: '在您的所有设备上保存对话记录。'
  },
  {
    icon: 'i-lucide-message-circle',
    title: '向 Nuxi 提问',
    description: '基于官方文档提供解答。'
  },
  {
    icon: 'i-lucide-git-branch',
    title: '分支探索',
    description: '探索不同方向，同时保留原有对话。'
  }
]

const chatPreview = [
  { from: 'user', text: '如何将 Nuxt 应用部署到 Vercel？', sources: undefined },
  {
    from: 'nuxi',
    text: '只需在 Vercel 导入您的仓库，Nuxt 会自动检测，`nuxt build` 无需配置即可运行。系统会自动应用 Vercel 预设。',
    sources: ['部署到 Vercel', 'Nitro 预设']
  },
  { from: 'user', text: '能告诉我如何启用 ISR 吗？', sources: undefined }
]

function parseMessage(text: string) {
  return text.split(/(`[^`]+`)/g).filter(Boolean).map(part =>
    part.startsWith('`') && part.endsWith('`')
      ? { type: 'code' as const, text: part.slice(1, -1) }
      : { type: 'text' as const, text: part }
  )
}

const recentChats = [
  { title: '将 Nuxt 应用部署到 Vercel', time: '2 分钟前', branched: false },
  { title: 'useFetch 与 useAsyncData 的区别', time: '1 小时前', branched: true },
  { title: 'Nuxt 文件系统路由', time: '昨天', branched: false },
  { title: '添加身份验证', time: '2 天前', branched: false }
]
</script>

<template>
  <div class="min-h-dvh bg-default relative overscroll-y-none overflow-hidden grid lg:grid-cols-2 isolate antialiased">
    <div class="flex flex-col px-6 sm:px-12 lg:px-16 py-6 sm:py-8 min-h-dvh">
      <div class="flex items-center justify-between">
        <UButton
          to="/"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-arrow-left"
          label="返回"
          class="-ml-2"
        />
        <NuxtLink to="/" aria-label="Nuxt 首页" class="inline-flex opacity-80 hover:opacity-100 transition-opacity">
          <NuxtLogo class="h-6 w-auto" />
        </NuxtLink>
      </div>

      <motion.div
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }"
        class="flex-1 flex flex-col justify-center gap-8 max-w-sm mx-auto w-full py-12"
      >
        <div class="flex flex-col gap-4">
          <h1 class="text-3xl sm:text-4xl font-semibold text-highlighted tracking-[-0.02em] leading-[1.1]">
            登录以解锁完整体验。
          </h1>
          <p class="text-sm/6 text-muted">
            使用 GitHub 账号保存进度并访问 Nuxt 中文文档的所有功能。
          </p>
        </div>

        <UButton
          :to="githubHref"
          icon="i-simple-icons-github"
          label="使用 GitHub 继续"
          color="neutral"
          variant="solid"
          size="lg"
          block
          external
        />

        <ul role="list" class="flex flex-col gap-2.5 pt-1 border-t border-default">
          <motion.li
            v-for="(feature, i) in features"
            :key="feature.title"
            :initial="{ opacity: 0, y: 6 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 0.3 + i * 0.08, ease: 'easeOut' }"
            class="flex items-start gap-2.5 pt-2.5"
          >
            <div class="size-6 mt-0.5 shrink-0 rounded-md bg-primary/10 border border-primary/15 flex items-center justify-center text-primary">
              <UIcon :name="feature.icon" class="size-3" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[0.8125rem] font-medium text-highlighted">
                {{ feature.title }}
              </p>
              <p class="text-xs text-muted mt-0.5 leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          </motion.li>
        </ul>

        <p class="text-[0.6875rem] text-dimmed leading-relaxed">
          我们不会保存您的 GitHub 令牌。账号中只会保存用户名和头像。
        </p>
      </motion.div>
    </div>

    <div class="hidden lg:block relative overflow-hidden border-l border-default bg-default">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-40 -right-40 size-[700px] bg-primary/12 rounded-full blur-3xl" />
        <div class="absolute top-1/3 -left-40 size-[500px] bg-primary/6 rounded-full blur-3xl" />
        <div class="absolute -bottom-40 right-1/4 size-[500px] bg-sky-500/5 rounded-full blur-3xl" />
        <!-- mask center is 50.01% (not 50%) on purpose: at exactly 50% lightningcss drops the default `at …`, leaving `radial-gradient(70% 60%, …)` which autoprefixer misreads as legacy positional syntax and warns on. The sub-pixel offset keeps `at …` in the output and is visually identical. -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[28px_28px] mask-[radial-gradient(ellipse_70%_60%_at_50%_50.01%,black,transparent_85%)]" />
      </div>

      <div class="relative h-full flex flex-col items-center justify-center px-8 xl:px-16 py-20 gap-8">
        <motion.div
          :initial="{ opacity: 0, y: 20, scale: 0.97 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :transition="{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }"
          class="relative w-full max-w-md"
        >
          <div class="relative rounded-2xl border border-default bg-default/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40">
            <div class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />

            <div class="px-4 py-3 border-b border-default flex items-center gap-2.5">
              <p class="text-xs font-medium text-default truncate flex-1 min-w-0">
                正在将 Nuxt 应用部署到 Vercel
              </p>
              <UIcon name="i-lucide-more-horizontal" class="size-3.5 text-dimmed" />
            </div>

            <div class="p-4 flex flex-col gap-4">
              <motion.div
                v-for="(msg, i) in chatPreview"
                :key="i"
                :initial="{ opacity: 0, y: 8 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.5 + i * 0.18, ease: 'easeOut' }"
              >
                <div v-if="msg.from === 'user'" class="flex justify-end">
                  <div class="max-w-[85%] rounded-2xl rounded-br-sm bg-primary/15 border border-primary/20 px-3.5 py-2 text-[0.8125rem] leading-relaxed text-highlighted">
                    {{ msg.text }}
                  </div>
                </div>

                <div v-else class="flex items-start gap-2.5">
                  <div class="size-6 rounded-lg border border-white/10 bg-elevated/80 flex items-center justify-center overflow-hidden shrink-0">
                    <AgentNuxiIcon class="size-4" mood="happy" :interactive="false" />
                  </div>
                  <div class="flex-1 min-w-0 flex flex-col gap-2 pt-0.5">
                    <p class="text-[0.8125rem] leading-relaxed text-default">
                      <template v-for="(part, idx) in parseMessage(msg.text)" :key="idx">
                        <code
                          v-if="part.type === 'code'"
                          class="font-mono mx-0.5 px-1.5 py-0.5 rounded-md bg-elevated text-primary border border-default text-[0.75rem]"
                        >{{ part.text }}</code>
                        <span v-else>{{ part.text }}</span>
                      </template>
                    </p>
                    <div v-if="msg.sources" class="flex items-center gap-3 text-[0.6875rem] text-dimmed">
                      <div class="flex items-center gap-1.5">
                        <UIcon name="i-lucide-book-open" class="size-3" />
                        <span>
                          <span
                            v-for="(src, sIdx) in msg.sources"
                            :key="src"
                          >
                            <span class="text-muted hover:text-primary transition-colors cursor-pointer">{{ src }}</span><span v-if="sIdx < msg.sources.length - 1" class="text-dimmed"> · </span>
                          </span>
                        </span>
                      </div>
                      <button
                        type="button"
                        class="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <UIcon name="i-lucide-git-branch" class="size-3" />
                        分支
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :transition="{ duration: 0.4, delay: 1.2 }"
                class="flex items-start gap-2.5"
              >
                <div class="size-6 rounded-lg border border-white/10 bg-elevated/80 flex items-center justify-center overflow-hidden shrink-0">
                  <AgentNuxiIcon class="size-4" mood="happy" :interactive="false" />
                </div>
                <div class="flex items-center gap-1 py-2">
                  <span class="size-1.5 rounded-full bg-neutral-500 animate-pulse [animation-delay:0ms]" />
                  <span class="size-1.5 rounded-full bg-neutral-500 animate-pulse [animation-delay:200ms]" />
                  <span class="size-1.5 rounded-full bg-neutral-500 animate-pulse [animation-delay:400ms]" />
                </div>
              </motion.div>
            </div>

            <div class="px-3 pb-3">
              <div class="rounded-xl border border-default bg-elevated/30 pl-3.5 pr-1.5 py-1.5 flex items-center gap-2">
                <p class="flex-1 min-w-0 text-xs text-dimmed truncate">
                  向 Nuxi 提问……
                </p>
                <div class="size-6 rounded-md bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-arrow-up" class="size-3.5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7, delay: 1.4, ease: [0.22, 1, 0.36, 1] }"
          class="relative w-full max-w-md flex flex-col gap-2"
        >
          <p class="text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-dimmed px-1">
            最近
          </p>
          <ul role="list" class="flex flex-col">
            <motion.li
              v-for="(chat, i) in recentChats"
              :key="chat.title"
              :initial="{ opacity: 0, x: -6 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.4, delay: 1.55 + i * 0.07, ease: 'easeOut' }"
              class="px-1 py-2 flex items-center gap-3 border-b border-default last:border-b-0"
            >
              <UIcon
                :name="chat.branched ? 'i-lucide-git-branch' : 'i-lucide-message-circle'"
                :class="['size-3 shrink-0', chat.branched ? 'text-primary' : 'text-dimmed']"
              />
              <p class="text-xs text-default truncate flex-1 min-w-0">
                {{ chat.title }}
              </p>
              <span class="text-[0.6875rem] text-dimmed shrink-0 tabular-nums">
                {{ chat.time }}
              </span>
            </motion.li>
          </ul>
        </motion.div>
      </div>
    </div>
  </div>
</template>
