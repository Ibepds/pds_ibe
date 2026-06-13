<script setup lang="ts">
import {
  CHALK_BUTTON_LABEL,
  CHALK_BUTTON_SRC,
  type ChalkButtonPreset,
} from '~/utils/daAssets'

const props = defineProps<{
  preset: ChalkButtonPreset
  to?: string
  href?: string
  external?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  class?: string
}>()

const src = computed(() => CHALK_BUTTON_SRC[props.preset])
const label = computed(() => CHALK_BUTTON_LABEL[props.preset])
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="chalk-btn mx-auto flex w-full max-w-[min(100%,20rem)] justify-center transition hover:opacity-90 active:scale-[0.98] sm:max-w-[22.5rem]"
    :class="props.class"
  >
    <img
      :src="src"
      :alt="label"
      class="mx-auto h-auto w-full max-w-[320px] object-contain md:max-w-[360px]"
      decoding="async"
    />
  </NuxtLink>
  <a
    v-else-if="href"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="chalk-btn mx-auto flex w-full max-w-[min(100%,20rem)] justify-center transition hover:opacity-90 active:scale-[0.98] sm:max-w-[22.5rem]"
    :class="props.class"
  >
    <img
      :src="src"
      :alt="label"
      class="mx-auto h-auto w-full max-w-[320px] object-contain md:max-w-[360px]"
      decoding="async"
    />
  </a>
  <button
    v-else
    :type="type ?? 'button'"
    :disabled="disabled"
    class="chalk-btn mx-auto flex w-full justify-center transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    :class="props.class"
  >
    <img
      :src="src"
      :alt="label"
      class="mx-auto h-auto w-full max-w-[320px] object-contain md:max-w-[360px]"
      decoding="async"
    />
  </button>
</template>
