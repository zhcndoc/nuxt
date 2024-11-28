<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-70'
})

const inputRef = ref()

const route = useRoute()
const { replaceRoute } = useFilters('modules')
const { fetchList, filteredModules, q, categories, stats, selectedOrder, sorts, selectedSort } = useModules()

const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())

const title = page.value.head?.title || page.value.title
const description = page.value.head?.description || page.value.description
useSeoMeta({
  titleTemplate: '%s - Nuxt 中文文档',
  title,
  description,
  ogDescription: description,
  ogTitle: title
})
defineOgImageComponent('Docs')

await fetchList()

defineShortcuts({
  '/': () => {
    inputRef.value.input.focus()
  }
})

const { copy } = useCopyToClipboard()
</script>

<template>
  <UContainer>
    <UPageHero v-bind="page" class="z-30">
      <template #description>
        <p>{{ page.description }}</p>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 justify-center">
          <div class="flex items-center gap-1.5">
            <UIcon name="i-ph-user-circle-fill" class="w-4 h-4 flex-shrink-0 dark:text-gray-200 text-gray-700" />
            <span class="text-sm font-medium">{{ formatNumber(stats.maintainers) }} 维护者</span>
          </div>
          <div class="flex items-center gap-1.5">
            <UIcon name="i-ph-users-three-fill" class="w-4 h-4 flex-shrink-0 dark:text-gray-200 text-gray-700" />
            <span class="text-sm font-medium">{{ formatNumber(stats.contributors) }} 贡献者</span>
          </div>
          <div class="flex items-center gap-1.5">
            <UIcon name="i-ph-puzzle-piece-fill" class="w-4 h-4 flex-shrink-0 dark:text-gray-200 text-gray-700" />
            <span class="text-sm font-medium">{{ formatNumber(stats.modules) }} 模块</span>
          </div>
        </div>
      </template>
    </UPageHero>

    <UPage id="smooth" class="pt-20 -mt-20">
      <template #left>
        <UAside>
          <UInput
            ref="inputRef"
            :model-value="q"
            name="q"
            icon="i-ph-magnifying-glass"
            placeholder="搜索模块..."
            class="w-full mb-2"
            size="md"
            autocomplete="off"
            :ui="{ icon: { trailing: { pointer: '' } } }"
            @update:model-value="replaceRoute('q', $event)"
          >
            <template #trailing>
              <UButton
                v-if="q"
                color="gray"
                variant="link"
                size="xs"
                icon="i-ph-x"
                :padded="false"
                @click="replaceRoute('q', '')"
              />
              <UKbd v-else>
                /
              </UKbd>
            </template>
          </UInput>
          <UButtonGroup class="mb-4 w-full">
            <USelectMenu
              :model-value="selectedSort"
              :options="sorts"
              size="md"
              color="white"
              class="w-full"
              @update:model-value="replaceRoute('sortBy', $event)"
            />
            <UButton
              :icon="selectedOrder.icon"
              size="md"
              color="gray"
              @click="replaceRoute('orderBy', selectedOrder.key === 'desc' ? 'asc' : 'desc')"
            />
          </UButtonGroup>
          <UNavigationTree :links="[{ label: '分类', disabled: true, children: categories }]" />
        </UAside>
      </template>

      <UPageBody class="lg:pl-8">
        <div class="lg:hidden mb-6 flex items-center gap-2">
          <UInput
            ref="inputRef"
            type="search"
            :model-value="q"
            name="q"
            icon="i-ph-magnifying-glass"
            placeholder="搜索模块..."
            class="w-full"
            size="sm"
            autocomplete="off"
            :ui="{ icon: { trailing: { pointer: '' } } }"
            @update:model-value="replaceRoute('q', $event)"
          />
          <UButtonGroup>
            <USelectMenu
              :model-value="selectedSort"
              :options="sorts"
              size="md"
              color="white"
              @update:model-value="replaceRoute('sortBy', $event)"
            />
            <UButton
              :icon="selectedOrder.icon"
              size="md"
              color="gray"
              @click="replaceRoute('orderBy', selectedOrder.key === 'desc' ? 'asc' : 'desc')"
            />
          </UButtonGroup>
        </div>
        <UPageGrid v-if="filteredModules?.length">
          <UPageCard
            v-for="(module, index) in filteredModules"
            :key="index"
            :to="`/modules/${module.name}`"
            :title="module.npm"
            class="flex flex-col overflow-hidden group"
            :ui="{
              to: 'hover:bg-white hover:ring-1',
              icon: { wrapper: 'mb-2' },
              body: { padding: 'p-4 sm:p-4', base: 'flex-1 dark:bg-gray-950' },
              footer: { base: 'dark:bg-gray-950 border-none', padding: 'px-4 sm:px-4 pt-0' }
            }"
          >
            <template #icon>
              <UAvatar
                :src="moduleImage(module.icon)"
                :icon="moduleIcon(module.category)"
                :alt="module.name"
                size="xs"
                :ui="{ rounded: 'rounded-md' }"
                class="pointer-events-none"
              />
            </template>

            <template #description>
              <span class="line-clamp-2 dark:text-gray-400 text-gray-500 text-sm">{{ module.description }}</span>
            </template>

            <UBadge
              v-if="module.type === 'official'"
              class="space-x-1 shine text-sm items-center justitfy-center pointer-events-none absolute top-4 right-4"
              size="xs"
              variant="subtle"
            >
              <span>官方</span>
            </UBadge>

            <UBadge
              v-if="module.sponsor"
              class="space-x-1 shine text-sm items-center justitfy-center pointer-events-none absolute top-4 right-4"
              size="xs"
              variant="subtle"
              color="pink"
            >
              <span>赞助</span>
            </UBadge>

            <template #footer>
              <UDivider type="dashed" class="mb-4" />
              <div class="flex items-center justify-between gap-3 -my-1 text-gray-600 dark:text-gray-300">
                <div class="flex items-center gap-3">
                  <UTooltip text="每月 NPM 下载量">
                    <NuxtLink
                      class="flex items-center gap-1 hover:text-gray-900 hover:dark:text-white"
                      :to="`https://npm.chart.dev/${module.npm}`"
                      target="_blank"
                    >
                      <UIcon name="i-ph-arrow-circle-down" class="w-4 h-4 flex-shrink-0" />
                      <span class="text-sm font-medium">{{ formatNumber(module.stats.downloads) }}</span>
                    </NuxtLink>
                  </UTooltip>

                  <UTooltip text="GitHub 星标">
                    <NuxtLink
                      class="flex items-center gap-1 hover:text-gray-900 hover:dark:text-white"
                      :to="`https://github.com/${module.repo}`"
                      target="_blank"
                    >
                      <UIcon name="i-ph-star" class="w-4 h-4 flex-shrink-0" />
                      <span class="text-sm font-medium">{{ formatNumber(module.stats.stars || 0) }}</span>
                    </NuxtLink>
                  </UTooltip>
                </div>

                <UTooltip
                  :text="`复制安装命令`"
                >
                  <UButton
                    icon="i-ph-terminal"
                    color="white"
                    size="2xs"
                    @click="copy(`npx nuxi@latest module add ${module.name}`, { title: '命令已复制到剪贴板：', description: `npx nuxi@latest module add ${module.name}` })"
                  />
                </UTooltip>
              </div>
            </template>
          </UPageCard>
        </UPageGrid>

        <EmptyCard v-else :label="`没有找到 ${q} 模块，成为第一个创建它的人！`">
          <UButton
            label="在 GitHub 上贡献"
            color="black"
            to="https://github.com/nuxt/modules"
            target="_blank"
            size="md"
            @click="$router.replace({ query: {} })"
          />
          <UButton to="/docs/guide/going-further/modules" color="white" size="md" label="如何创建模块？" />
        </EmptyCard>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<style lang="postcss">
.group:hover .shine {
  text-decoration: none;
  display: inline-block;
  mask-image: linear-gradient(-75deg, rgba(255,255,255,.8) 30%, #fff 50%, rgba(255,255,255,.8) 70%);
  mask-size: 200%;
  animation: shine 2s linear infinite;
}

@keyframes shine {
  from { -webkit-mask-position: 150%; }
  to { -webkit-mask-position: -50%; }
}
</style>
