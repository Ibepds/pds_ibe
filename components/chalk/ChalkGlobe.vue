<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ChalkImage
    :src="DA.picto.highFive"
    class="mx-auto w-full max-w-[130px]"
    :class="$attrs.class"
  />
</template>
