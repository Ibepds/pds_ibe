<script setup lang="ts">
import { DA } from '~/utils/daAssets'

const props = defineProps<{
  liveUrl: string
  youtubeUrl?: string
  tiktokUrl?: string
}>()

const otherPlatforms = computed(() =>
  [
    { label: 'TikTok', url: props.tiktokUrl, icon: DA.retours.tiktok },
    { label: 'YouTube', url: props.youtubeUrl, icon: DA.retours.youtube },
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
  <!-- Lecteur live calé dans le trou transparent du picto craie (PICTO°1) -->
  <!-- Le picto définit la taille ; la vidéo est positionnée exactement dans son encadré -->
  <div class="relative mx-auto w-full max-w-5xl">
    <!-- Cadre étiré (un peu plus haut + débordant vers la gauche) ; la vidéo suit en % -->
    <div class="relative -ml-[5%] aspect-[1.4/1] w-[105%]">
      <img
        :src="DA.retours.liveFrame"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 z-10 h-full w-full select-none object-fill"
      />
      <!-- Zone écran = trou du picto (fond noir). La vidéo 16:9 est calée EN BAS,
           laissant une bande noire en haut, pile sous le badge « LIVE » du picto. -->
      <div class="absolute bottom-[7%] left-[3.5%] right-[4%] top-[4%] overflow-hidden bg-black">
      <iframe
        v-if="embedUrl"
        :src="embedUrl"
        class="absolute inset-x-0 bottom-0 aspect-video w-full"
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
  </div>
  </div>
  <!-- Bouton principal : regarder sur Twitch -->
  <div v-if="liveUrl" class="mt-6 flex justify-center">
    <a
      :href="liveUrl"
      target="_blank"
      rel="noopener"
      class="block w-full max-w-md transition hover:opacity-90 active:scale-[0.98]"
      aria-label="Regarder sur Twitch"
    >
      <img :src="DA.retours.btnTwitch" alt="Regarder sur Twitch" class="mx-auto h-auto w-full object-contain" decoding="async" />
    </a>
  </div>

  <!-- Autres plateformes -->
  <div v-if="otherPlatforms.length" class="mt-8 text-center">
    <img
      :src="DA.retours.ouRegarder"
      alt="Ou regarder sur"
      class="mx-auto h-auto w-40 object-contain md:w-48"
      loading="lazy"
      decoding="async"
    />
    <div class="mt-5 flex items-center justify-center gap-10">
      <a
        v-for="p in otherPlatforms"
        :key="p.label"
        :href="p.url"
        target="_blank"
        rel="noopener"
        class="flex flex-col items-center gap-2 transition hover:opacity-90 active:scale-95"
        :aria-label="p.label"
      >
        <img :src="p.icon" :alt="p.label" class="h-14 w-14 object-contain md:h-16 md:w-16" decoding="async" />
        <span class="font-display text-[10px] font-bold uppercase tracking-wide text-white/80">{{ p.label }}</span>
      </a>
    </div>
  </div>
</template>
