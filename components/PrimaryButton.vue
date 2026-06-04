<script setup lang="ts">
defineProps<{
  to?: string
  href?: string
  variant?: 'primary' | 'outline'
  external?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
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
    :type="type ?? 'button'"
    :disabled="disabled"
    :class="[variant === 'outline' ? 'btn-outline' : 'btn-primary', disabled && 'opacity-50 cursor-not-allowed']"
  >
    <slot />
  </button>
</template>
