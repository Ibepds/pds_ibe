<script setup lang="ts">
import { MOCK_ASSOCIATIONS } from '~/utils/mockData'
import { DA } from '~/utils/daAssets'

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
  <div class="home-container pb-16">
    <!-- Hero -->
    <section class="pt-8 text-center md:pt-12">
      <ChalkTitleHero line1="Associations" line2="Soutenues" :image="DA.retours.titreAssos" large />
      <p v-reveal class="mx-auto mt-8 max-w-2xl leading-relaxed text-white/80 md:text-lg">
        L'ensemble des fonds récoltés lors de PDS Humanity est reversé à ces associations
        partenaires.
      </p>
    </section>

    <!-- Liste -->
    <section class="mt-14 md:mt-20">
      <div v-if="loading" class="space-y-12">
        <div v-for="n in 2" :key="n" class="mx-auto h-48 max-w-2xl animate-pulse bg-white/10" />
      </div>

      <div v-else-if="error" class="text-center text-accent-rose">{{ error }}</div>

      <div v-else class="space-y-16 md:space-y-24">
        <article
          v-for="asso in associations"
          :key="asso.id ?? asso.name"
          v-reveal
          class="mx-auto max-w-2xl text-center"
        >
          <!-- Logo -->
          <img
            v-if="asso.logoUrl"
            :src="asso.logoUrl"
            :alt="`Logo ${asso.name}`"
            loading="lazy"
            decoding="async"
            class="mx-auto h-16 w-auto max-w-[200px] object-contain md:h-20"
          />
          <div
            v-else
            class="mx-auto flex h-16 w-16 items-center justify-center font-display text-2xl font-bold text-white/80 md:h-20 md:w-20"
          >
            {{ asso.name.charAt(0) }}
          </div>

          <!-- Nom -->
          <h2 class="mt-5 font-display text-2xl font-bold uppercase tracking-wide md:text-3xl">
            {{ asso.name }}
          </h2>

          <!-- Description -->
          <p class="mx-auto mt-4 max-w-xl whitespace-pre-line leading-relaxed text-white/75">
            {{ asso.description }}
          </p>

          <p v-if="asso.mission" class="mx-auto mt-3 max-w-xl text-sm text-white/55">
            <strong class="text-white/80">Mission :</strong> {{ asso.mission }}
          </p>

          <PrimaryButton
            v-if="asso.websiteUrl"
            :href="asso.websiteUrl"
            external
            variant="outline"
            class="mt-6"
          >
            Site de l'association
          </PrimaryButton>
        </article>
      </div>

      <div class="mt-16 flex justify-center">
        <ChalkButton preset="donate" to="/donate" class="!max-w-[400px] md:!max-w-[480px]" />
      </div>
    </section>
  </div>
</template>
