<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  src: string
  alt?: string
}>()
</script>

<template>
  <img
    :src="src"
    :alt="alt ?? ''"
    aria-hidden="true"
    class="chalk-img object-contain"
    :class="$attrs.class"
  />
</template>
