<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })

defineProps<{
  large?: boolean
  alt?: string
}>()
</script>

<template>
  <ChalkImage
    :src="DA.cgpt.childrenGlobe"
    :alt="alt ?? 'Association partenaire'"
    transparent
    :class="[
      'mx-auto block w-full object-contain object-center',
      large
        ? 'max-w-[180px] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[300px]'
        : 'max-w-[140px] sm:max-w-[180px] md:max-w-[220px]',
      $attrs.class,
    ]"
  />
</template>
