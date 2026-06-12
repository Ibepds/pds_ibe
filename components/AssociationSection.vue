<script setup lang="ts">
import type { AssociationDoc } from '~/types'

defineProps<{
  association: AssociationDoc | null
  loading?: boolean
}>()
</script>

<template>
  <section class="py-24 md:py-32">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <h2 class="section-title">L'association</h2>
      <p class="mt-2 text-gray-400">Découvrez la cause que nous soutenons</p>

      <div v-if="loading" class="mt-8 card-glow h-64 animate-pulse" />
      <div v-else-if="association" class="mt-8 grid gap-8 lg:grid-cols-2">
        <div class="card-glow p-8">
          <div
            class="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-green/30 to-primary/30 font-display text-3xl font-bold"
          >
            {{ association.name.charAt(0) }}
          </div>
          <h3 class="font-display text-2xl font-bold">{{ association.name }}</h3>
          <p class="mt-4 text-gray-300">{{ association.description }}</p>
          <p class="mt-4 text-sm text-gray-400">
            <strong class="text-white">Mission :</strong> {{ association.mission }}
          </p>
          <PrimaryButton
            v-if="association.websiteUrl"
            :href="association.websiteUrl"
            external
            variant="outline"
            class="mt-6"
          >
            Site de l'association
          </PrimaryButton>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <StatCard
            v-for="kn in association.keyNumbers"
            :key="kn.label"
            :label="kn.label"
            :value="kn.value"
            accent="cyan"
          />
        </div>
      </div>
    </div>
  </section>
</template>
