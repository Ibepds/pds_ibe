<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ChalkImage
    :src="DA.picto.childrenGlobe"
    class="mx-auto w-full max-w-[320px] md:max-w-[480px] lg:max-w-[560px]"
    :class="$attrs.class"
  />
</template>
