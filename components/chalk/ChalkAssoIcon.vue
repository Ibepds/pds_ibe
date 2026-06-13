<script setup lang="ts">
defineProps<{ variant: 'hand' | 'drop' | 'house' | 'waves' }>()
</script>

<template>
  <!-- Main tendue -->
  <svg
    v-if="variant === 'hand'"
    class="mx-auto h-16 w-16 text-white"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
  >
    <path d="M32 52V28M22 32l10-8 10 8M18 38c0 8 6 14 14 14s14-6 14-14" />
    <path d="M28 22c0-4 4-8 4-8s4 4 4 8" />
    <path d="M32 38c-3-4-8-4-8 0 0 4 8 6 8-2 0-4-2-4-2" class="text-primary-light" />
  </svg>
  <!-- Eau & vie -->
  <svg
    v-else-if="variant === 'drop'"
    class="mx-auto h-16 w-16 text-white"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
  >
    <path d="M32 8c-8 14-16 24-16 34a16 16 0 1032 0c0-10-8-20-16-34z" />
  </svg>
  <!-- Toit pour tous -->
  <svg
    v-else-if="variant === 'house'"
    class="mx-auto h-16 w-16 text-white"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linejoin="round"
  >
    <path d="M8 32 L32 12 L56 32 V52 H8 Z" />
    <path d="M26 52 V36 H38 V52" />
    <path d="M32 40c-2-3-6-3-6 0 0 3 6 5 6 5s6-2 6-5c0-3-4-3-6 0z" class="text-primary-light" />
  </svg>
  <!-- Dignité -->
  <svg
    v-else
    class="mx-auto h-16 w-16 text-white"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
  >
    <path d="M12 48 Q20 28 32 28 Q44 28 52 48" />
    <path d="M12 48 Q20 38 32 38 Q44 38 52 48" />
    <path d="M12 48 Q20 58 32 58 Q44 58 52 48" />
  </svg>
</template>
