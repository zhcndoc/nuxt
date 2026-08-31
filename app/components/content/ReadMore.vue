<script setup lang="ts">
const props = defineProps({
  to: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false,
    default: ''
  }
})

const computedTitle = computed<string>(() => props.title || createBreadcrumb(props.to))
</script>

<template>
  <ProseCallout icon="i-lucide-bookmark" :to="to" :aria-label="computedTitle">
    <slot mdc-unwrap="p">
      在 <span class="font-bold" v-text="computedTitle" /> 中查看详情
    </slot>
  </ProseCallout>
</template>
