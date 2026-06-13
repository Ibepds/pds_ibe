<script setup lang="ts">
defineProps<{
  large?: boolean
}>()
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="mx-auto w-full max-w-3xl text-center">
      <h2
        v-reveal
        class="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 font-display font-bold uppercase tracking-wide"
        :class="large ? 'text-2xl md:text-4xl lg:text-5xl' : 'section-heading'"
      >
        <ChalkHeart :class="large ? '!h-6 !w-6 md:!h-8 md:!w-8 lg:!h-10 lg:!w-10' : '!h-5 !w-5'" />
        C'est quoi PDS Humanity ?
        <ChalkSparkles :class="large ? '!h-8 !w-6 md:!h-10 md:!w-7' : '!h-5 !w-4'" />
      </h2>

      <div
        v-reveal
        class="mx-auto leading-relaxed !text-left text-white/80"
        :class="large ? 'mt-8 max-w-2xl space-y-5 text-base md:mt-10 md:text-lg' : 'mt-6 space-y-4 text-sm md:text-base'"
      >
        <p>
          Pendant <strong class="font-semibold text-white">24 heures</strong>, créateurs, artistes et
          invités se réunissent pour un marathon caritatif diffusé en direct.
        </p>
        <p>
          Au programme : des <strong class="font-semibold text-white">tables rondes</strong>, des
          <strong class="font-semibold text-white">concepts</strong> inédits, des
          <strong class="font-semibold text-white">enchères solidaires</strong> et des
          <strong class="font-semibold text-white">freestyles</strong>…
        </p>
        <p class="flex items-start gap-2">
          <ChalkSparkles class="mt-1 !h-5 !w-4 shrink-0" />
          <span>
            Et <strong class="font-semibold text-white">toutes les 15 minutes</strong>, un nouvel
            artiste rejoint le live pour une performance exclusive.
          </span>
        </p>
      </div>

      <div
        v-reveal
        class="mx-auto flex items-start gap-3 border-2 border-white/35 bg-white/5 !text-left"
        :class="large ? 'mt-10 max-w-2xl p-6 md:mt-12 md:p-7' : 'mt-8 max-w-xl p-5'"
      >
        <ChalkHeart class="mt-0.5 shrink-0 !h-5 !w-5 opacity-90 md:!h-6 md:!w-6" />
        <p class="text-white/80" :class="large ? 'text-sm md:text-base lg:text-lg' : 'text-xs md:text-sm'">
          L'objectif est de récolter un maximum de fonds grâce aux dons et aux enchères solidaires,
          qui seront intégralement reversés à
          <strong class="font-semibold text-white">trois associations bénéficiaires</strong>.
        </p>
      </div>
    </div>
  </section>
</template>
