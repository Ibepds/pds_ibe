<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ChalkImage
    :src="DA.picto.heart"
    class="mx-auto w-full max-w-[140px]"
    :class="$attrs.class"
  />
</template>
