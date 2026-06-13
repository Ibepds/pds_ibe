<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ChalkImage
    :src="DA.picto.trophy"
    class="h-[18px] w-[18px] shrink-0"
    :class="$attrs.class"
  />
</template>
