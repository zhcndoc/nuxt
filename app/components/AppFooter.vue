<script setup lang="ts">
const { footerLinks } = useFooterLinks()
</script>

<template>
  <USeparator icon="i-simple-icons-nuxtdotjs" class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="footerLinks">
          <template #right>
            <NewsletterForm />
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        <a target="_blank" href="https://www.zhcndoc.com">
          简中文档
        </a>
        -
        <a rel="nofollow" target="_blank" href="https://beian.miit.gov.cn">
          沪ICP备2024070610号-3
        </a>
      </p>
    </template>

    <template #right>
      <UButton
        color="neutral"
        variant="ghost"
        to="https://go.nuxt.com/x"
        target="_blank"
        icon="i-simple-icons-x"
      >
        <span class="sr-only">Nuxt on X</span>
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        to="https://go.nuxt.com/bluesky"
        target="_blank"
        icon="i-simple-icons-bluesky"
      >
        <span class="sr-only">Nuxt on BlueSky</span>
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        to="https://go.nuxt.com/linkedin"
        target="_blank"
        icon="i-simple-icons-linkedin"
      >
        <span class="sr-only">Nuxt on LinkedIn</span>
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        to="https://go.nuxt.com/discord"
        target="_blank"
        icon="i-simple-icons-discord"
      >
        <span class="sr-only">Nuxt on Discord</span>
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        to="https://go.nuxt.com/github"
        target="_blank"
        icon="i-simple-icons-github"
      >
        <span class="sr-only">Nuxt on GitHub</span>
      </UButton>
    </template>
  </UFooter>
</template>
