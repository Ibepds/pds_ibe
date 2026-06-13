<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  logoUrl?: string
  name: string
  large?: boolean
}>()

const sizeClass = computed(() =>
  props.large
    ? 'h-20 max-w-[200px] sm:max-w-[220px] md:h-28 md:max-w-[280px] lg:h-32 lg:max-w-[320px]'
    : 'h-14 max-w-[160px] md:h-20 md:max-w-[200px]',
)

const detailSizeClass = 'h-16 w-16 max-w-[120px] md:h-20 md:max-w-[140px]'

/** Logo craie DA (picto-7) — rendu transparent sans mix-blend */
function isDaChalkLogo(url: string): boolean {
  return url.includes('/images/da/') || url.includes('picto-7')
}

const resolvedSrc = computed(() => {
  const url = props.logoUrl?.trim()
  if (url) return url
  return DA.cgpt.assoLogo
})

const useChalkRender = computed(() => {
  const url = props.logoUrl?.trim()
  return !url || isDaChalkLogo(url)
})
</script>

<template>
  <ChalkImage
    v-if="useChalkRender"
    :src="resolvedSrc"
    :alt="name"
    transparent
    :class="[
      'mx-auto block w-auto object-contain object-center',
      large ? sizeClass : detailSizeClass,
      $attrs.class,
    ]"
  />
  <img
    v-else
    :src="resolvedSrc"
    :alt="name"
    loading="lazy"
    decoding="async"
    :class="[
      'mx-auto block w-auto object-contain object-center brightness-0 invert opacity-90',
      large ? sizeClass : detailSizeClass,
      $attrs.class,
    ]"
  />
</template>
