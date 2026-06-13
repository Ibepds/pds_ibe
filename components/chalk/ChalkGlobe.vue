<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ChalkImage
    :src="DA.cgpt.childrenGlobe"
    transparent
    class="mx-auto block w-full max-w-[130px] object-contain object-center"
    :class="$attrs.class"
  />
</template>
