<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string | number
  accent?: 'violet' | 'cyan' | 'rose' | 'green'
}>()

const accentClass = computed(() => {
  const map = {
    violet: 'text-primary-light',
    cyan: 'text-primary-light',
    rose: 'text-accent-rose',
    green: 'text-accent-green',
  }
  return map[props.accent ?? 'violet']
})
</script>

<template>
  <div class="border-t border-white/15 py-4 text-center">
    <p class="text-sm uppercase tracking-wider text-white/50">{{ label }}</p>
    <p class="mt-2 font-display text-2xl font-bold sm:text-3xl" :class="accentClass">
      {{ value }}
    </p>
  </div>
</template>
