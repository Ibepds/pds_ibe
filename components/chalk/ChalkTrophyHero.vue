<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })

defineProps<{
  large?: boolean
}>()
</script>

<template>
  <ChalkImage
    :src="DA.picto.childrenGlobe"
    alt="PDS Humanity"
    :class="[
      'mx-auto w-full',
      large
        ? 'max-w-[420px] sm:max-w-[520px] md:max-w-[640px] lg:max-w-[760px] xl:max-w-[860px]'
        : 'max-w-[320px] md:max-w-[480px] lg:max-w-[560px]',
      $attrs.class,
    ]"
  />
</template>
