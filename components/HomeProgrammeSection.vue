<script setup lang="ts">
import type { ScheduleItem } from '~/types'

const props = defineProps<{
  items: ScheduleItem[]
  loading?: boolean
  limit?: number
  /** Intégré sous le compteur (sans section séparée) */
  embedded?: boolean
  large?: boolean
}>()

const allProgrammeItems = computed(() =>
  [...props.items]
    .filter((i) => !i.title.toLowerCase().includes('freestyle'))
    .sort((a, b) => a.order - b.order),
)

const programmeItems = computed(() =>
  props.limit ? allProgrammeItems.value.slice(0, props.limit) : allProgrammeItems.value,
)

const showProgrammeComplet = computed(
  () => !!props.limit && allProgrammeItems.value.length > props.limit,
)
</script>

<template>
  <section :class="embedded ? 'w-full' : 'section-divider py-12 md:py-16'">
    <div class="w-full">
      <div v-reveal class="flex items-center justify-center gap-3 md:gap-5">
        <ChalkSparkles :class="large ? '!h-10 !w-7 md:!h-14 md:!w-9 lg:!h-16 lg:!w-10' : ''" />
        <h2
          class="font-display font-bold uppercase tracking-wide"
          :class="large ? 'text-2xl md:text-4xl lg:text-5xl' : 'text-xl md:text-2xl'"
        >
          Le programme
        </h2>
        <ChalkSparkles
          class="scale-x-[-1]"
          :class="large ? '!h-10 !w-7 md:!h-14 md:!w-9 lg:!h-16 lg:!w-10' : ''"
        />
      </div>

      <div v-reveal :class="large ? 'mt-10 md:mt-12' : 'mt-8'">
        <ScheduleTimeline :items="programmeItems" :loading="loading" :large="large" />
      </div>

      <ProgrammeCompletFreestyle :large="large" :show-programme-complet="showProgrammeComplet" />
    </div>
  </section>
</template>
