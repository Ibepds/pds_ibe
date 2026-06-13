<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ChalkImage
    :src="DA.cgpt.sparkles"
    class="h-8 w-5 shrink-0 opacity-90"
    :class="$attrs.class"
  />
</template>
