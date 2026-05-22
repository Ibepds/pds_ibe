<script setup lang="ts">
defineProps<{
  to?: string
  href?: string
  variant?: 'primary' | 'outline'
  external?: boolean
}>()
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="variant === 'outline' ? 'btn-outline' : 'btn-primary'"
  >
    <slot />
  </NuxtLink>
  <a
    v-else-if="href"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :class="variant === 'outline' ? 'btn-outline' : 'btn-primary'"
  >
    <slot />
  </a>
  <button
    v-else
    type="button"
    :class="variant === 'outline' ? 'btn-outline' : 'btn-primary'"
  >
    <slot />
  </button>
</template>
