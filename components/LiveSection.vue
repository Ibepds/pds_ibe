<script setup lang="ts">
defineProps<{
  isLive: boolean
  liveUrl: string
}>()
</script>

<template>
  <section class="py-16">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <h2 class="section-title gradient-text">En direct</h2>
      <p class="mt-2 text-gray-400">
        Suivez l'événement en temps réel
      </p>

      <div class="mt-8 card-glow overflow-hidden">
        <div
          class="relative aspect-video bg-gradient-to-br from-surface-elevated to-surface-card flex items-center justify-center"
        >
          <div
            v-if="isLive"
            class="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-sm font-semibold"
          >
            <span class="h-2 w-2 animate-pulse rounded-full bg-white" />
            LIVE
          </div>
          <div class="text-center p-8">
            <div
              class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 text-4xl"
            >
              ▶
            </div>
            <p v-if="isLive" class="text-lg text-gray-300">
              Le live est en cours — rejoignez-nous !
            </p>
            <p v-else class="text-lg text-gray-400">
              Le live n'est pas encore démarré. Consultez le planning.
            </p>
            <PrimaryButton
              v-if="isLive && liveUrl"
              :href="liveUrl"
              external
              class="mt-6"
            >
              Ouvrir le stream
            </PrimaryButton>
            <PrimaryButton v-else to="/planning" variant="outline" class="mt-6">
              Voir le planning
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
