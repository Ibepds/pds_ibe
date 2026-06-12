<script setup lang="ts">
import { MOCK_ASSOCIATIONS } from '~/utils/mockData'

definePageMeta({ pageBackground: 'white' })

usePageSeo({
  title: 'Associations soutenues — PDS Humanity',
  description:
    "Les associations partenaires de PDS Humanity. 100% des fonds récoltés lors de l'événement leur sont reversés.",
})

const { data: associations, loading, error } = useFirestoreCollection(
  'associations',
  MOCK_ASSOCIATIONS,
)
</script>

<template>
  <div class="py-20 md:py-28">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <h1 class="section-title gradient-text">Associations soutenues</h1>
      <p class="accent-serif mt-4 max-w-2xl text-lg text-white/75 md:text-xl">
        L'ensemble des fonds récoltés lors de PDS Humanity est reversé à ces associations partenaires.
      </p>

      <div v-if="loading" class="mt-10 space-y-8">
        <div v-for="n in 2" :key="n" class="card-glow h-64 animate-pulse" />
      </div>

      <div v-else-if="error" class="mt-10 text-center text-accent-rose">{{ error }}</div>

      <div v-else class="mt-10 space-y-10">
        <div
          v-for="asso in associations"
          :key="asso.id ?? asso.name"
          class="card-glow p-8"
        >
          <div class="grid gap-8 lg:grid-cols-3">
            <div class="lg:col-span-2">
              <div class="flex items-start gap-5">
                <div
                  v-if="asso.logoUrl"
                  class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl"
                >
                  <img
                    :src="asso.logoUrl"
                    :alt="`Logo ${asso.name}`"
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/30 to-primary/30 font-display text-2xl font-bold"
                >
                  {{ asso.name.charAt(0) }}
                </div>
                <div>
                  <h2 class="font-display text-2xl font-bold text-white">{{ asso.name }}</h2>
                  <p class="mt-3 text-gray-300 leading-relaxed">{{ asso.description }}</p>
                  <p class="mt-3 text-sm text-gray-400">
                    <strong class="text-white">Mission :</strong> {{ asso.mission }}
                  </p>
                  <PrimaryButton
                    v-if="asso.websiteUrl"
                    :href="asso.websiteUrl"
                    external
                    variant="outline"
                    class="mt-5"
                  >
                    Site de l'association
                  </PrimaryButton>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 content-start">
              <StatCard
                v-for="kn in asso.keyNumbers"
                :key="kn.label"
                :label="kn.label"
                :value="kn.value"
                accent="cyan"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <PrimaryButton to="/donate">Faire un don</PrimaryButton>
      </div>
    </div>
  </div>
</template>
