<script setup lang="ts">
import type { FaqItem } from '~/types'

const props = defineProps<{
  items: FaqItem[]
  loading?: boolean
  limit?: number
  /** Maquette accueil : titre + lien uniquement */
  teaser?: boolean
  showLink?: boolean
}>()

const openId = ref<string | null>(null)

const sorted = computed(() => {
  const list = [...props.items].sort((a, b) => a.order - b.order)
  return props.limit ? list.slice(0, props.limit) : list
})

const toggle = (id: string) => {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="w-full text-center">
      <div v-reveal class="flex flex-col items-center gap-3">
        <div class="flex items-center gap-3">
          <ChalkSparkles />
          <ChalkHeart />
          <h2 class="font-display text-lg font-bold uppercase tracking-wide md:text-xl">
            Questions fréquentes
          </h2>
          <ChalkHeart />
          <ChalkSparkles class="scale-x-[-1]" />
        </div>
      </div>

      <template v-if="!teaser">
        <div v-if="loading" class="mt-8 space-y-3">
          <div v-for="i in 3" :key="i" class="h-12 animate-pulse bg-white/10" />
        </div>
        <div v-else v-reveal class="mt-8 space-y-2 text-left">
          <div
            v-for="item in sorted"
            :key="item.id"
            class="border-b border-white/20"
          >
            <button
              class="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold uppercase tracking-wide transition hover:text-primary-light"
              @click="toggle(item.id)"
            >
              {{ item.question }}
              <span class="text-primary-light text-xl">{{ openId === item.id ? '−' : '+' }}</span>
            </button>
            <div
              v-show="openId === item.id"
              class="pb-4 text-sm leading-relaxed text-white/70"
            >
              {{ item.answer }}
            </div>
          </div>
        </div>
      </template>

      <div v-if="showLink !== false" v-reveal class="mt-8">
        <NuxtLink
          to="/faq"
          class="text-sm font-semibold uppercase tracking-wide text-primary-light hover:underline"
        >
          → Voir toutes les questions
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
