<script setup lang="ts">
import { resolveDaIconSrc } from '~/utils/daIcons'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  icon: string
  alt?: string
}>()

const src = computed(() => resolveDaIconSrc(props.icon))
</script>

<template>
  <span class="da-icon inline-flex shrink-0 justify-center md:inline-flex">
    <ChalkImage
      v-if="src"
      :src="src"
      :alt="alt"
      class="chalk-picto !mx-0"
      v-bind="$attrs"
    />
  </span>
</template>
