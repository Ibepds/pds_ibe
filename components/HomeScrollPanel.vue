<script setup lang="ts">
defineProps<{
  id?: string
}>()

const panelRef = ref<HTMLElement | null>(null)
const innerRef = ref<HTMLElement | null>(null)
const effectsEnabled = ref(false)

const updatePanel = () => {
  if (!effectsEnabled.value) return

  const panel = panelRef.value
  const inner = innerRef.value
  if (!panel || !inner) return

  const { top } = panel.getBoundingClientRect()
  const vh = window.innerHeight
  const fadeRange = vh * 0.55

  let opacity = 1
  if (top <= 0) {
    opacity = Math.max(0, 1 + top / fadeRange)
  } else if (top < vh) {
    opacity = Math.max(0.35, 1 - top / fadeRange)
  } else {
    opacity = 0
  }

  inner.style.opacity = String(opacity)
  inner.style.transform = `scale(${0.96 + 0.04 * opacity})`
  inner.style.pointerEvents = opacity < 0.2 ? 'none' : 'auto'
}

const resetPanel = () => {
  const inner = innerRef.value
  if (!inner) return
  inner.style.opacity = '1'
  inner.style.transform = 'none'
  inner.style.pointerEvents = 'auto'
}

const onResize = () => {
  const isMobile = window.matchMedia('(max-width: 767px)').matches
  effectsEnabled.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !isMobile
  if (!effectsEnabled.value) resetPanel()
  else updatePanel()
}

onMounted(() => {
  if (!import.meta.client) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = window.matchMedia('(max-width: 767px)').matches
  effectsEnabled.value = !reduce && !mobile

  if (!effectsEnabled.value) {
    resetPanel()
    return
  }

  updatePanel()
  window.addEventListener('scroll', updatePanel, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
})

onUnmounted(() => {
  if (!import.meta.client) return
  window.removeEventListener('scroll', updatePanel)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section :id="id" ref="panelRef" class="home-panel">
    <div ref="innerRef" class="home-panel-inner">
      <div class="home-panel-content">
        <slot />
      </div>
    </div>
  </section>
</template>
