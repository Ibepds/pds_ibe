<script setup lang="ts">
import type { ScheduleItem } from '~/types'

const props = defineProps<{
  items: ScheduleItem[]
  loading?: boolean
  limit?: number
}>()

const typeColors: Record<string, string> = {
  stream: 'border-primary/30 bg-primary/5',
  show: 'border-accent-red/30 bg-accent-red/5',
  pause: 'border-ink/15 bg-ink/[0.03]',
  special: 'border-ink/20 bg-ink/[0.04]',
}

const displayed = computed(() => {
  const sorted = [...props.items].sort((a, b) => a.order - b.order)
  return props.limit ? sorted.slice(0, props.limit) : sorted
})

const byDay = computed(() => {
  const map = new Map<string, ScheduleItem[]>()
  for (const item of displayed.value) {
    const list = map.get(item.day) ?? []
    list.push(item)
    map.set(item.day, list)
  }
  return map
})
</script>

<template>
  <div v-if="loading" class="space-y-4">
    <div v-for="i in 4" :key="i" class="h-24 animate-pulse rounded-xl bg-ink/5" />
  </div>
  <div v-else class="space-y-10">
    <div v-for="[day, dayItems] in byDay" :key="day">
      <h3 class="font-display text-xl font-bold uppercase tracking-wide text-ink">{{ day }}</h3>
      <div class="mt-4 space-y-4 border-l-2 border-ink/15 pl-6">
        <div
          v-for="item in dayItems"
          :key="item.id"
          class="relative rounded-xl border p-4"
          :class="typeColors[item.type] ?? typeColors.special"
        >
          <span
            class="absolute -left-[31px] top-5 h-3 w-3 rounded-full bg-primary"
          />
          <div class="flex flex-wrap items-center gap-3">
            <span class="font-mono text-sm font-semibold text-primary">{{ item.time }}</span>
            <span class="text-xs uppercase tracking-wide text-ink/50">{{ item.type }}</span>
          </div>
          <h4 class="mt-1 font-semibold text-ink">{{ item.title }}</h4>
          <p class="mt-1 text-sm text-ink/60">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
