<script setup lang="ts">
defineProps<{
  title: string
  lead?: string
  subtitle?: string
  align?: 'left' | 'center'
}>()
</script>

<template>
  <header v-reveal :class="align === 'center' ? 'text-center' : ''">
    <div
      class="flex flex-wrap items-center justify-center gap-2"
      :class="align === 'center' ? '' : ''"
    >
      <ChalkSparkles v-if="align === 'center'" />
      <h1
        class="section-heading"
        :class="align !== 'center' ? '!justify-start' : ''"
      >
        <ChalkHeart v-if="align !== 'center'" />
        {{ title }}
      </h1>
      <ChalkSparkles v-if="align === 'center'" class="scale-x-[-1]" />
    </div>
    <p
      v-if="lead"
      class="accent-serif mt-4 text-lg md:text-xl"
      :class="align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'"
    >
      {{ lead }}
    </p>
    <p
      v-if="subtitle"
      class="mt-2 text-xs uppercase tracking-wide text-white/60 md:text-sm"
      :class="align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'"
    >
      {{ subtitle }}
    </p>
  </header>
</template>
