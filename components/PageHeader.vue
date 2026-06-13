<script setup lang="ts">
defineProps<{
  title: string
  lead?: string
  subtitle?: string
  align?: 'left' | 'center'
  compact?: boolean
}>()
</script>

<template>
  <header v-reveal :class="align === 'center' ? 'text-center' : 'text-center md:text-left'">
    <div
      class="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center"
      :class="align !== 'center' ? 'md:justify-start' : ''"
    >
      <ChalkSparkles v-if="align === 'center'" class="chalk-inline" />
      <ChalkHeart v-if="align !== 'center'" class="chalk-picto !h-6 !w-6 md:!inline-block" />
      <h1
        class="font-display font-bold uppercase leading-tight tracking-wide"
        :class="
          compact
            ? 'text-base md:text-lg'
            : ['section-heading', align !== 'center' && 'section-heading-left']
        "
      >
        {{ title }}
      </h1>
      <ChalkSparkles v-if="align === 'center'" class="chalk-inline scale-x-[-1]" />
    </div>
    <p
      v-if="lead"
      class="accent-serif text-white/80"
      :class="[
        compact ? 'mt-2 text-sm md:text-base' : 'mt-4 text-lg md:text-xl',
        align === 'center' ? 'mx-auto max-w-2xl' : 'mx-auto max-w-2xl md:mx-0',
      ]"
    >
      {{ lead }}
    </p>
    <p
      v-if="subtitle"
      class="uppercase tracking-wide text-white/60"
      :class="[
        compact ? 'mt-1 text-[10px] md:text-xs' : 'mt-2 text-xs md:text-sm',
        align === 'center' ? 'mx-auto max-w-2xl' : 'mx-auto max-w-2xl md:mx-0',
      ]"
    >
      {{ subtitle }}
    </p>
  </header>
</template>
