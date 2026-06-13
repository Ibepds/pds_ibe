<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ChalkImage
    :src="DA.cgpt.dove"
    class="mx-auto w-full max-w-[90px] md:max-w-[120px]"
    :class="$attrs.class"
  />
</template>
