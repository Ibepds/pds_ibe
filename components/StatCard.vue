<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string | number
  accent?: 'violet' | 'cyan' | 'rose' | 'green'
}>()

const accentClass = computed(() => {
  const map = {
    violet: 'text-primary-light shadow-glow',
    cyan: 'text-accent-cyan shadow-glow-cyan',
    rose: 'text-accent-rose shadow-glow-rose',
    green: 'text-accent-green',
  }
  return map[props.accent ?? 'violet']
})
</script>

<template>
  <div class="card-glow p-6 text-center">
    <p class="text-sm uppercase tracking-wider text-gray-400">{{ label }}</p>
    <p class="mt-2 font-display text-3xl font-bold" :class="accentClass">
      {{ value }}
    </p>
  </div>
</template>
