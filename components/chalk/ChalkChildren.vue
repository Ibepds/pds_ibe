<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ChalkImage
    :src="DA.cgpt.childrenGlobe"
    transparent
    class="mx-auto block w-full max-w-[320px] object-contain object-center md:max-w-[480px] lg:max-w-[560px]"
    :class="$attrs.class"
  />
</template>
