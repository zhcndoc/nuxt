<script setup>
import { vIntersectionObserver } from '@vueuse/components'

const getImage = useImage()
const start = ref(0)
const total = 6 * 4
const contributors = useState('contributors-grid', () => [])
const intersecting = ref(false)
let _contributors
let currentTimeout

function onIntersectionObserver([{ isIntersecting }]) {
  intersecting.value = isIntersecting
  if (isIntersecting) {
    if (_contributors) {
      contributors.value = _contributors
    }
    startTimer()
  } else {
    stopTimer()
  }
}
// Fetch on client-side
onMounted(async () => {
  if (contributors.value.length) return
  _contributors = await $fetch('https://api.nuxt.com/contributors').then(data => data.slice(0, total * 10).map(c => c.username))
  await loadImages(_contributors.slice(0, total))
  if (!contributors.value.length && intersecting.value) {
    contributors.value = _contributors
  }
})
onBeforeUnmount(stopTimer)

const $contributors = computed(() => contributors.value.length ? contributors.value.slice(start.value, start.value + total) : Array.from({ length: total }).fill(null))
function startTimer(ms = 5000) {
  currentTimeout = setTimeout(nextContributors, ms)
}
function stopTimer() {
  clearTimeout(currentTimeout)
  currentTimeout = null
}
async function loadImages(usernames) {
  const size = window.devicePixelRatio === 2 ? '160px' : '80px'
  await Promise.all(usernames.map((username) => {
    const img = new Image()
    img.src = getImage(`https://markhub.top/github/${username}?size=80`, { height: size, width: size, format: 'auto' })

    return new Promise((resolve) => {
      img.onload = resolve
      img.onerror = resolve
    })
  }))
}
async function nextContributors() {
  const newStart = (start.value + total >= contributors.value.length ? 0 : start.value + total)
  await loadImages(contributors.value.slice(newStart, newStart + total))
  start.value = newStart
  startTimer()
}
</script>

<template>
  <div
    v-intersection-observer="onIntersectionObserver"
    class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-4 sm:gap-8 lg:gap-6 xl:gap-8 xl:p-8"
    @mouseenter="stopTimer()"
    @mouseleave="startTimer(2500)"
  >
    <div
      v-for="(username, index) in $contributors"
      :key="index"
      class="pt-[100%] relative"
    >
      <Transition
        name="avatar"
        mode="out-in"
        appear
      >
        <a
          v-if="username"
          :key="username"
          :href="`https://nuxters.nuxt.com/${username}`"
          target="_blank"
          class="absolute inset-0 flex transition-all"
          :style="{
            'transition-delay': `${(index % 8 + Math.floor(index / 8)) * 20}ms`
          }"
        >
          <UTooltip :text="username" class="w-full">
            <NuxtImg
              :src="`https://markhub.top/github/${username}?size=80`"
              densities="x1 x2"
              height="80"
              format="auto"
              width="80"
              :alt="username"
              loading="lazy"
              :title="username"
              class="rounded-xl w-full h-full transition lg:hover:scale-125 bg-muted"
            />
          </UTooltip>
        </a>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.avatar-enter-active,
.avatar-leave-active {
  transition: all 0.4s ease;
}

.avatar-enter-from,
.avatar-leave-to {
  opacity: 0.1;
  transform: scale(0.5);
}
</style>
