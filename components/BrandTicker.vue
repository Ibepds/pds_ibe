<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items?: string[]
    variant?: 'solid' | 'outline'
  }>(),
  {
    items: () => [],
    variant: 'solid',
  },
)

const DEFAULT_ITEMS = ['LIVE 24H', 'GROS DONS !', 'ASSOCIATIONS CARITATIVES', 'STREAM BY IBÉ']

// Repli sur les valeurs par défaut si aucun item fourni
const tickerItems = computed(() =>
  props.items && props.items.filter((i) => i.trim()).length
    ? props.items.filter((i) => i.trim())
    : DEFAULT_ITEMS,
)
</script>

<template>
  <div
    class="relative overflow-hidden border-y border-white/10"
    :class="props.variant === 'solid' ? 'bg-primary' : 'bg-white/5 backdrop-blur'"
  >
    <div class="flex w-max animate-marquee whitespace-nowrap py-3">
      <div v-for="copy in 2" :key="copy" class="flex items-center">
        <template v-for="(item, i) in tickerItems" :key="`${copy}-${i}`">
          <span class="px-6 font-display text-lg font-bold uppercase tracking-wide text-white md:text-xl">
            {{ item }}
          </span>
          <span class="text-base text-white/40">●</span>
        </template>
      </div>
    </div>
  </div>
</template>
