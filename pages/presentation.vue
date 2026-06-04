<script setup lang="ts">
useHead({ title: 'Présentation — PDS Humanity' })
</script>

<template>
  <div class="py-12">
    <div class="mx-auto max-w-4xl px-4 lg:px-8">
      <h1 class="section-title gradient-text">Présentation</h1>
      <p class="mt-2 text-gray-400">PDS Humanity — Musique & Solidarité</p>

      <div class="mt-10 space-y-10">
        <div class="card-glow p-8">
          <h2 class="font-display text-2xl font-bold text-white">L'événement</h2>
          <p class="mt-4 text-gray-300 leading-relaxed">
            <strong class="text-white">PDS Humanity</strong> est un marathon caritatif de 24 heures
            mêlant musique et solidarité. L'événement se tient du
            <strong class="text-primary-light">27 juin (18h) au 28 juin (18h)</strong> et est
            diffusé en direct sur Twitch, YouTube et TikTok.
          </p>
          <p class="mt-4 text-gray-300 leading-relaxed">
            Pendant 24h se succèdent performances musicales, freestyles, contenus en direct et
            temps forts de collecte de dons. Trois leviers de mobilisation sont réunis :
            la cagnotte de dons en ligne, les ventes aux enchères solidaires sur eBay Live et
            les freestyles nocturnes ouverts au public.
          </p>
        </div>

        <div class="card-glow p-8">
          <h2 class="font-display text-2xl font-bold text-white">Le concept</h2>
          <div class="mt-4 grid gap-6 md:grid-cols-3">
            <div class="rounded-xl bg-white/5 p-5">
              <div class="text-3xl">🎵</div>
              <h3 class="mt-3 font-semibold text-white">Musique live</h3>
              <p class="mt-2 text-sm text-gray-400">
                Performances, freestyles et concerts en direct tout au long du marathon de 24h.
              </p>
            </div>
            <div class="rounded-xl bg-white/5 p-5">
              <div class="text-3xl">❤️</div>
              <h3 class="mt-3 font-semibold text-white">Solidarité</h3>
              <p class="mt-2 text-sm text-gray-400">
                100% des fonds collectés reversés aux associations partenaires.
              </p>
            </div>
            <div class="rounded-xl bg-white/5 p-5">
              <div class="text-3xl">🏆</div>
              <h3 class="mt-3 font-semibold text-white">Enchères</h3>
              <p class="mt-2 text-sm text-gray-400">
                Ventes aux enchères solidaires en direct sur eBay Live avec des lots exclusifs.
              </p>
            </div>
          </div>
        </div>

        <div class="card-glow p-8">
          <h2 class="font-display text-2xl font-bold text-white">Le porteur du projet</h2>
          <p class="mt-4 text-gray-300 leading-relaxed">
            <strong class="text-white">PDS Records</strong> est un label indépendant fondé par
            <strong class="text-primary-light">Ibé</strong>, artiste engagé et producteur.
            PDS Humanity est produit et organisé en interne par PDS Records / Ibé, avec la
            conviction que la musique peut être un puissant vecteur de solidarité.
          </p>
        </div>

        <div class="card-glow p-8">
          <h2 class="font-display text-2xl font-bold text-white">Les plateformes de diffusion</h2>
          <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl bg-white/5 p-4 text-center">
              <div class="text-2xl">📺</div>
              <p class="mt-2 font-semibold text-white">Twitch</p>
            </div>
            <div class="rounded-xl bg-white/5 p-4 text-center">
              <div class="text-2xl">▶️</div>
              <p class="mt-2 font-semibold text-white">YouTube</p>
            </div>
            <div class="rounded-xl bg-white/5 p-4 text-center">
              <div class="text-2xl">🎵</div>
              <p class="mt-2 font-semibold text-white">TikTok</p>
            </div>
            <div class="rounded-xl bg-white/5 p-4 text-center">
              <div class="text-2xl">🛒</div>
              <p class="mt-2 font-semibold text-white">eBay Live</p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <PrimaryButton to="/donate">Faire un don</PrimaryButton>
          <PrimaryButton to="/freestyles" variant="outline">Réserver un freestyle</PrimaryButton>
          <PrimaryButton to="/planning" variant="outline">Voir le programme</PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>
