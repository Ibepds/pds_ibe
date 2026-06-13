<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ChalkImage
    :src="DA.picto.heartSm"
    class="h-3.5 w-3.5 shrink-0"
    :class="$attrs.class"
  />
</template>
