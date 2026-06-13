<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ChalkImage
    :src="DA.trait.stroke5"
    class="h-4 w-8 shrink-0 opacity-90"
    :class="$attrs.class"
  />
</template>
