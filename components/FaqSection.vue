<script setup lang="ts">
import type { FaqItem } from '~/types'

const props = defineProps<{
  items: FaqItem[]
  loading?: boolean
  limit?: number
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
  <section class="py-16">
    <div class="mx-auto max-w-3xl px-4 lg:px-8">
      <h2 class="section-title text-center">Questions fréquentes</h2>
      <div v-if="loading" class="mt-8 space-y-3">
        <div v-for="i in 4" :key="i" class="h-14 animate-pulse rounded-xl bg-white/5" />
      </div>
      <div v-else class="mt-8 space-y-3">
        <div
          v-for="item in sorted"
          :key="item.id"
          class="card-glow overflow-hidden"
        >
          <button
            class="flex w-full items-center justify-between p-5 text-left font-semibold transition hover:bg-white/5"
            @click="toggle(item.id)"
          >
            {{ item.question }}
            <span class="text-primary-light">{{ openId === item.id ? '−' : '+' }}</span>
          </button>
          <div
            v-show="openId === item.id"
            class="border-t border-white/5 px-5 pb-5 text-gray-400"
          >
            {{ item.answer }}
          </div>
        </div>
      </div>
      <div v-if="limit" class="mt-6 text-center">
        <NuxtLink to="/faq" class="text-primary-light hover:underline">
          Voir toutes les questions →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
