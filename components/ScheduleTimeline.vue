<script setup lang="ts">
import type { ScheduleItem } from '~/types'
import { DA } from '~/utils/daAssets'

const props = defineProps<{
  items: ScheduleItem[]
  loading?: boolean
  limit?: number
}>()

const displayed = computed(() => {
  const sorted = [...props.items].sort((a, b) => a.order - b.order)
  return props.limit ? sorted.slice(0, props.limit) : sorted
})

/** 18:00 → 18H00 */
function formatTimeChalk(time: string): string {
  const [h, m] = time.split(':')
  return `${h}H${m ?? '00'}`
}

type RowStyle = {
  icon: 'chat' | 'gift' | 'star' | 'mic' | 'crown'
  color: string
  titleColor: string
  showHeart?: boolean
  isFreestyle?: boolean
}

function getRowStyle(item: ScheduleItem): RowStyle {
  const t = item.title.toLowerCase()
  if (t.includes('freestyle')) {
    return { icon: 'mic', color: 'border-accent-green text-accent-green', titleColor: 'text-accent-green', isFreestyle: true }
  }
  if (t.includes('enchère') || t.includes('enchere')) {
    const isFinal = t.includes('finale')
    return {
      icon: isFinal ? 'crown' : 'gift',
      color: isFinal ? 'border-accent-yellow text-accent-yellow' : 'border-accent-yellow text-accent-yellow',
      titleColor: 'text-accent-yellow',
      showHeart: !isFinal,
    }
  }
  if (t.includes('table ronde') || t.includes('ronde')) {
    return { icon: 'chat', color: 'border-accent-purple text-accent-purple', titleColor: 'text-accent-purple' }
  }
  return { icon: 'star', color: 'border-primary-light text-primary-light', titleColor: 'text-primary-light' }
}
</script>

<template>
  <div v-if="loading" class="space-y-4 px-5">
    <div v-for="i in 6" :key="i" class="h-14 animate-pulse bg-white/10" />
  </div>
  <ul v-else class="divide-y divide-white/15">
    <li
      v-for="item in displayed"
      :key="item.id"
      class="grid grid-cols-[3.5rem_3rem_1fr_auto] items-center gap-2 py-4 md:grid-cols-[4.5rem_3.5rem_1fr_auto] md:gap-3"
    >
      <!-- Heure -->
      <span class="font-display text-sm font-bold uppercase md:text-base">
        {{ item.time ? formatTimeChalk(item.time) : '—' }}
      </span>

      <!-- Icône cercle -->
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full border-2 md:h-11 md:w-11"
        :class="getRowStyle(item).color"
      >
        <ChalkImage
          v-if="getRowStyle(item).icon === 'chat'"
          :src="DA.picto.highFive"
          class="h-6 w-6"
        />
        <ChalkImage
          v-else-if="getRowStyle(item).icon === 'gift'"
          :src="DA.picto.gift"
          class="h-6 w-6"
        />
        <svg v-else-if="getRowStyle(item).icon === 'mic'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="9" y="3" width="6" height="10" rx="3" />
          <path d="M5 11a7 7 0 0014 0M12 18v3" stroke-linecap="round" />
        </svg>
        <ChalkImage
          v-else-if="getRowStyle(item).icon === 'crown'"
          :src="DA.picto.trophy"
          class="h-6 w-6"
        />
        <ChalkImage
          v-else
          :src="DA.picto.highFive"
          class="h-6 w-6"
        />
      </div>

      <!-- Titre + description -->
      <div class="min-w-0 border-l border-white/25 pl-3">
        <p class="font-display text-sm font-bold uppercase leading-tight md:text-base" :class="getRowStyle(item).titleColor">
          {{ item.title }}
        </p>
        <p v-if="item.description" class="mt-0.5 text-xs text-white/60 md:text-sm">
          {{ item.description }}
        </p>
        <PrimaryButton
          v-if="getRowStyle(item).isFreestyle"
          to="/freestyles"
          variant="outline"
          class="mt-2 !border-accent-green !px-3 !py-1.5 !text-[10px] !text-accent-green hover:!bg-accent-green/10 md:!text-xs"
        >
          Réserver mon créneau
        </PrimaryButton>
      </div>

      <!-- Cœur enchères -->
      <div class="flex w-6 justify-center">
        <ChalkHeart
          v-if="getRowStyle(item).showHeart"
          class="!h-4 !w-4 opacity-90"
        />
      </div>
    </li>
  </ul>
</template>
