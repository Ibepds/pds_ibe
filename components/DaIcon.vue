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
  <ChalkImage
    v-if="src"
    :src="src"
    :alt="alt"
    v-bind="$attrs"
  />
</template>
