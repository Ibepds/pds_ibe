<script setup lang="ts">
const props = defineProps<{
  liveUrl: string
  youtubeUrl?: string
  tiktokUrl?: string
}>()

const otherPlatforms = computed(() =>
  [
    { label: 'TikTok', url: props.tiktokUrl },
    { label: 'YouTube', url: props.youtubeUrl },
  ].filter((p) => p.url),
)

const parent = ref('')

onMounted(() => {
  parent.value = window.location.hostname
})

const channel = computed(() => {
  if (!props.liveUrl) return ''
  try {
    const u = new URL(props.liveUrl)
    if (!u.hostname.replace(/^www\./, '').includes('twitch.tv')) return ''
    return u.pathname.split('/').filter(Boolean)[0] ?? ''
  } catch {
    return ''
  }
})

const embedUrl = computed(() => {
  if (!channel.value || !parent.value) return ''
  return `https://player.twitch.tv/?channel=${encodeURIComponent(channel.value)}&parent=${encodeURIComponent(parent.value)}&autoplay=true&muted=false`
})
</script>

<template>
  <div class="relative mx-auto aspect-video w-full max-w-4xl overflow-hidden border-2 border-white/35 bg-black">
    <div
      class="absolute left-4 top-4 z-10 flex items-center gap-2 bg-accent-red/90 px-3 py-1 text-xs font-bold uppercase tracking-wide"
    >
      <span class="h-2 w-2 animate-pulse rounded-full bg-white" />
      Live
    </div>
    <iframe
      v-if="embedUrl"
      :src="embedUrl"
      class="h-full w-full"
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowfullscreen
      frameborder="0"
      title="Live PDS Humanity — Twitch"
    />
    <div v-else class="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p class="text-sm text-white/70">Le lecteur Twitch sera disponible dès le début du live.</p>
      <PrimaryButton v-if="liveUrl" :href="liveUrl" external variant="outline">
        Ouvrir sur Twitch
      </PrimaryButton>
    </div>
  </div>
  <!-- Bouton principal : regarder sur Twitch -->
  <div v-if="liveUrl" class="mt-6 flex justify-center">
    <a
      :href="liveUrl"
      target="_blank"
      rel="noopener"
      class="inline-flex items-center gap-3 border-2 border-white px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10 md:text-base"
    >
      Regarder sur Twitch
      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  </div>

  <!-- Autres plateformes -->
  <div v-if="otherPlatforms.length" class="mt-6 text-center">
    <p class="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary-light">
      Ou regarder sur
    </p>
    <div class="mt-4 flex items-center justify-center gap-8">
      <a
        v-for="p in otherPlatforms"
        :key="p.label"
        :href="p.url"
        target="_blank"
        rel="noopener"
        class="flex flex-col items-center gap-1.5 text-white/80 transition hover:text-white"
      >
        <span class="flex h-14 w-14 items-center justify-center border-2 border-white/40">
          <span class="font-display text-xs font-bold uppercase">{{ p.label.slice(0, 2) }}</span>
        </span>
        <span class="font-display text-[10px] font-bold uppercase tracking-wide">{{ p.label }}</span>
      </a>
    </div>
  </div>
</template>
