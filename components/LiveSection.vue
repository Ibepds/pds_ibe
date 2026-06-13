<script setup lang="ts">
const props = defineProps<{
  isLive: boolean
  liveUrl: string
}>()

// Domaine parent requis par l'embed Twitch (déterminé côté client)
const parent = ref('')
onMounted(() => {
  parent.value = window.location.hostname
})

// Déduit l'URL d'embed à partir de l'URL de live (Twitch ou YouTube)
const embedUrl = computed(() => {
  if (!props.liveUrl) return ''
  try {
    const u = new URL(props.liveUrl)
    const host = u.hostname.replace(/^www\./, '')

    if (host.includes('twitch.tv')) {
      const channel = u.pathname.split('/').filter(Boolean)[0]
      if (!channel || !parent.value) return ''
      return `https://player.twitch.tv/?channel=${channel}&parent=${parent.value}&autoplay=true&muted=true`
    }

    if (host.includes('youtu.be') || host.includes('youtube.com')) {
      let videoId = ''
      if (host.includes('youtu.be')) {
        videoId = u.pathname.split('/').filter(Boolean)[0] ?? ''
      } else if (u.searchParams.get('v')) {
        videoId = u.searchParams.get('v') ?? ''
      } else {
        const parts = u.pathname.split('/').filter(Boolean)
        const idx = parts.findIndex((p) => p === 'live' || p === 'embed')
        if (idx >= 0 && parts[idx + 1]) videoId = parts[idx + 1]
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
    }
  } catch {
    return ''
  }
  return ''
})

const showEmbed = computed(() => props.isLive && !!embedUrl.value)
</script>

<template>
  <section class="py-24 md:py-32">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <p class="section-label">( En direct )</p>
      <h2 class="section-title">
        Suivez le live
        <span class="block text-primary">en temps réel.</span>
      </h2>

      <div class="mt-10 overflow-hidden border border-ink/10">
        <!-- Lecteur intégré (visible directement, sans clic) -->
        <div v-if="showEmbed" class="relative aspect-video bg-black">
          <div
            class="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-sm font-semibold"
          >
            <span class="h-2 w-2 animate-pulse rounded-full bg-white" />
            LIVE
          </div>
          <iframe
            :src="embedUrl"
            class="h-full w-full"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowfullscreen
            frameborder="0"
            title="Live PDS Humanity"
          />
        </div>

        <!-- Live en cours mais embed indisponible (autre plateforme) -->
        <div
          v-else-if="isLive"
          class="relative aspect-video bg-gradient-to-br from-surface-elevated to-surface-card flex items-center justify-center"
        >
          <div
            class="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-sm font-semibold"
          >
            <span class="h-2 w-2 animate-pulse rounded-full bg-white" />
            LIVE
          </div>
          <div class="text-center p-8">
            <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 text-4xl">▶</div>
            <p class="text-lg text-gray-300">Le live est en cours — rejoignez-nous !</p>
            <PrimaryButton v-if="liveUrl" :href="liveUrl" external class="mt-6">
              Ouvrir le stream
            </PrimaryButton>
          </div>
        </div>

        <!-- Écran d'attente « PATIENTEZ » (identité PDS Humanity) -->
        <div
          v-else
          class="relative flex aspect-video items-center justify-center overflow-hidden bg-black"
        >
          <div class="pointer-events-none absolute inset-0 bg-primary-dark/20" />
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(5,70,160,0.35),_transparent_60%)]" />
          <div class="relative px-6 text-center">
            <p class="font-display text-5xl font-bold uppercase leading-none tracking-tight text-white md:text-7xl">
              Patientez <span class="text-primary-light">♥</span>
            </p>
            <p class="accent-serif -mt-1 text-3xl text-white/90 md:text-5xl">le stream va</p>
            <p class="font-display text-5xl font-bold uppercase leading-none tracking-tight text-white md:text-7xl">
              Commencer…
            </p>
            <PrimaryButton to="/planning" variant="outline" class="mt-8">
              Voir le programme
            </PrimaryButton>
          </div>
        </div>
      </div>

      <!-- Lien d'ouverture sur la plateforme, en complément de l'embed -->
      <div v-if="showEmbed && liveUrl" class="mt-4 text-center">
        <a
          :href="liveUrl"
          target="_blank"
          rel="noopener"
          class="text-sm font-semibold text-primary hover:underline"
        >
          Ouvrir sur la plateforme ↗
        </a>
      </div>
    </div>
  </section>
</template>
