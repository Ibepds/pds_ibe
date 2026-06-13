<script setup lang="ts">
import { MOCK_ASSOCIATIONS } from '~/utils/mockData'

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
  <div class="home-container">
    <section class="py-12 md:py-16">
      <PageHeader
        title="Associations soutenues"
        lead="L'ensemble des fonds récoltés lors de PDS Humanity est reversé à ces associations partenaires."
      />
    </section>

    <section class="section-divider py-12 md:py-16">
      <div v-if="loading" class="space-y-8">
        <div v-for="n in 2" :key="n" class="h-48 animate-pulse bg-white/10" />
      </div>

      <div v-else-if="error" class="text-center text-accent-rose">{{ error }}</div>

      <ul v-else class="divide-y divide-white/15">
        <li
          v-for="asso in associations"
          :key="asso.id ?? asso.name"
          v-reveal
          class="py-10 first:pt-0"
        >
          <div class="grid gap-8 lg:grid-cols-3">
            <div class="lg:col-span-2">
              <div class="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
                <div class="mx-auto flex shrink-0 items-center justify-center sm:mx-0">
                  <AssociationLogo :logo-url="asso.logoUrl" :name="asso.name" />
                </div>
                <div class="w-full min-w-0">
                  <h2 class="font-display text-2xl font-bold uppercase text-white">{{ asso.name }}</h2>
                  <p class="mt-3 leading-relaxed text-white/75">{{ asso.description }}</p>
                  <p class="mt-3 text-sm text-white/60">
                    <strong class="text-white">Mission :</strong> {{ asso.mission }}
                  </p>
                  <PrimaryButton
                    v-if="asso.websiteUrl"
                    :href="asso.websiteUrl"
                    external
                    variant="outline"
                    class="mt-5 w-full max-w-xs sm:w-auto"
                  >
                    Site de l'association
                  </PrimaryButton>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 content-start gap-x-4">
              <StatCard
                v-for="kn in asso.keyNumbers"
                :key="kn.label"
                :label="kn.label"
                :value="kn.value"
                accent="cyan"
              />
            </div>
          </div>
        </li>
      </ul>

      <div class="mt-12 flex justify-center">
        <ChalkButton preset="donate" to="/donate" />
      </div>
    </section>
  </div>
</template>
