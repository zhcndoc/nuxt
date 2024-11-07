<script setup lang="ts">
const { footerLinks } = useNavigation()
</script>

<template>
  <UFooter
    :ui="{
      bottom: { wrapper: 'border-t border-gray-200 dark:border-gray-800', container: '!py-6' },
      top: { wrapper: 'border-t border-gray-200 dark:border-gray-800', container: 'py-8 lg:py-12' }
    }"
  >
    <template #top>
      <UFooterColumns :links="footerLinks">
        <template #right>
          <NewsletterForm />
        </template>
      </UFooterColumns>
    </template>

    <template #left>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        <a target="_blank" href="https://www.zhcndoc.com?ref=nuxt">
          简中文档
        </a>
        -
        <a rel="nofollow" target="_blank" href="https://beian.miit.gov.cn">
          沪ICP备2024070610号-3
        </a>
      </p>
    </template>

    <template #right>
      <UButton aria-label="Nuxt on X" to="https://go.nuxt.com/x" target="_blank" icon="i-simple-icons-x" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Nuxt on BlueSky" to="https://go.nuxt.com/bluesky" target="_blank" icon="i-simple-icons-bluesky" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Nuxt on LinkedIn" to="https://go.nuxt.com/linkedin" target="_blank" icon="i-simple-icons-linkedin" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Nuxt on Discord" to="https://go.nuxt.com/discord" target="_blank" icon="i-simple-icons-discord" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Github" to="https://github.com/nuxt/nuxt" target="_blank" icon="i-simple-icons-github" v-bind="($ui.button.secondary as any)" />
    </template>
  </UFooter>
</template>
