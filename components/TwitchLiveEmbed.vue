<script setup lang="ts">
const props = defineProps<{
  liveUrl: string
}>()

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
  <p v-if="embedUrl && liveUrl" class="mt-4 text-center">
    <a
      :href="liveUrl"
      target="_blank"
      rel="noopener"
      class="text-sm font-semibold uppercase tracking-wide text-primary-light hover:underline"
    >
      Ouvrir sur Twitch ↗
    </a>
  </p>
</template>
