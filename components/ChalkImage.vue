<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  src: string
  alt?: string
  /** PNG déjà détouré (fond transparent) — pas de mix-blend screen */
  transparent?: boolean
}>()
</script>

<template>
  <img
    :src="src"
    :alt="alt ?? ''"
    aria-hidden="true"
    class="chalk-img object-contain"
    :class="[{ 'chalk-img--alpha': transparent }, $attrs.class]"
  />
</template>
