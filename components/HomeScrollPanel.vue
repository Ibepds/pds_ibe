<script setup lang="ts">
defineProps<{
  id?: string
}>()

const panelRef = ref<HTMLElement | null>(null)
const innerRef = ref<HTMLElement | null>(null)

const updatePanel = () => {
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
    opacity = Math.max(0.2, 1 - top / fadeRange)
  } else {
    opacity = 0
  }

  const scale = 0.92 + 0.08 * opacity
  inner.style.opacity = String(opacity)
  inner.style.transform = `scale(${scale})`
  inner.style.pointerEvents = opacity < 0.15 ? 'none' : 'auto'
}

onMounted(() => {
  if (!import.meta.client) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return

  updatePanel()
  window.addEventListener('scroll', updatePanel, { passive: true })
  window.addEventListener('resize', updatePanel, { passive: true })
})

onUnmounted(() => {
  if (!import.meta.client) return
  window.removeEventListener('scroll', updatePanel)
  window.removeEventListener('resize', updatePanel)
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
