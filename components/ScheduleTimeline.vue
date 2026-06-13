<script setup lang="ts">
import type { ScheduleItem } from '~/types'
import { DA } from '~/utils/daAssets'

const props = defineProps<{
  items: ScheduleItem[]
  loading?: boolean
  limit?: number
  large?: boolean
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
    <div
      v-for="i in 6"
      :key="i"
      class="animate-pulse bg-white/10"
      :class="large ? 'h-20' : 'h-14'"
    />
  </div>
  <ul v-else class="divide-y divide-white/15">
    <li
      v-for="item in displayed"
      :key="item.id"
      class="grid items-center gap-2 py-4 md:gap-3 md:py-5"
      :class="
        large
          ? 'grid-cols-[2.75rem_2.5rem_1fr] sm:grid-cols-[4rem_3.25rem_1fr_auto] md:grid-cols-[5.5rem_4.5rem_1fr_auto] md:py-6 lg:py-7'
          : 'grid-cols-[2.75rem_2.5rem_1fr] sm:grid-cols-[4.5rem_3.5rem_1fr_auto]'
      "
    >
      <!-- Heure -->
      <span
        class="font-display font-bold uppercase"
        :class="large ? 'text-sm sm:text-base md:text-xl lg:text-2xl' : 'text-sm md:text-base'"
      >
        {{ item.time ? formatTimeChalk(item.time) : '—' }}
      </span>

      <!-- Icône cercle -->
      <div
        class="flex items-center justify-center rounded-full border-2"
        :class="[
          large ? 'h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16' : 'h-10 w-10 md:h-11 md:w-11',
          getRowStyle(item).color,
        ]"
      >
        <ChalkImage
          v-if="getRowStyle(item).icon === 'chat'"
          :src="DA.picto.highFive"
          :class="large ? 'h-8 w-8 md:h-9 md:w-9' : 'h-6 w-6'"
        />
        <ChalkImage
          v-else-if="getRowStyle(item).icon === 'gift'"
          :src="DA.picto.gift"
          :class="large ? 'h-8 w-8 md:h-9 md:w-9' : 'h-6 w-6'"
        />
        <svg
          v-else-if="getRowStyle(item).icon === 'mic'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          :class="large ? 'h-7 w-7 md:h-8 md:w-8' : 'h-5 w-5'"
        >
          <rect x="9" y="3" width="6" height="10" rx="3" />
          <path d="M5 11a7 7 0 0014 0M12 18v3" stroke-linecap="round" />
        </svg>
        <ChalkImage
          v-else-if="getRowStyle(item).icon === 'crown'"
          :src="DA.picto.trophy"
          :class="large ? 'h-8 w-8 md:h-9 md:w-9' : 'h-6 w-6'"
        />
        <ChalkImage
          v-else
          :src="DA.picto.highFive"
          :class="large ? 'h-8 w-8 md:h-9 md:w-9' : 'h-6 w-6'"
        />
      </div>

      <!-- Titre + description -->
      <div class="min-w-0 border-l border-white/25 pl-3 md:pl-4">
        <p
          class="font-display font-bold uppercase leading-tight"
          :class="[
            large ? 'text-sm sm:text-base md:text-lg lg:text-xl' : 'text-sm md:text-base',
            getRowStyle(item).titleColor,
          ]"
        >
          {{ item.title }}
        </p>
        <p
          v-if="item.description"
          class="mt-1 text-white/60"
          :class="large ? 'text-sm md:text-base' : 'mt-0.5 text-xs md:text-sm'"
        >
          {{ item.description }}
        </p>
        <PrimaryButton
          v-if="getRowStyle(item).isFreestyle"
          to="/freestyles"
          variant="outline"
          class="mt-2 !border-accent-green !text-accent-green hover:!bg-accent-green/10"
          :class="large ? '!px-4 !py-2 !text-xs md:!text-sm' : '!px-3 !py-1.5 !text-[10px] md:!text-xs'"
        >
          Réserver mon créneau
        </PrimaryButton>
      </div>

      <!-- Cœur enchères -->
      <div class="hidden justify-center sm:flex" :class="large ? 'w-8' : 'w-6'">
        <ChalkHeart
          v-if="getRowStyle(item).showHeart"
          class="opacity-90"
          :class="large ? '!h-6 !w-6 md:!h-7 md:!w-7' : '!h-4 !w-4'"
        />
      </div>
    </li>
  </ul>
</template>
