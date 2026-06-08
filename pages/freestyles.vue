<script setup lang="ts">
import { MOCK_FREESTYLE_SLOTS, MOCK_FREESTYLE_BOOKINGS } from '~/utils/mockData'

usePageSeo({
  title: 'Réservation freestyles — PDS Humanity',
  description:
    'Réservez votre créneau pour les freestyles nocturnes de PDS Humanity (nuit du 27 au 28 juin, 03h00 → 10h29). 56 créneaux ouverts au public.',
})

const { data: slots, loading: slotsLoading } = useFirestoreCollection(
  'freestyleSlots',
  MOCK_FREESTYLE_SLOTS,
  { orderField: 'order', orderDirection: 'asc' },
)

const { data: bookings, loading: bookingsLoading } = useFirestoreCollection(
  'freestyles',
  MOCK_FREESTYLE_BOOKINGS,
)

const { create } = useAdminFirestore()

// Créneaux pris (réservations en attente ou validées)
const takenSlots = computed(() =>
  bookings.value
    .filter((b) => b.status !== 'rejected')
    .map((b) => b.slot),
)

const form = reactive({
  pseudo: '',
  email: '',
  socialLinks: '',
  slot: '',
  trackUrl: '',
  message: '',
})

const sending = ref(false)
const sent = ref(false)
const error = ref('')

const isSlotTaken = (label: string) => takenSlots.value.includes(label)

const availableCount = computed(
  () => slots.value.length - slots.value.filter((s) => isSlotTaken(s.label)).length,
)

const selectSlot = (label: string) => {
  if (isSlotTaken(label)) return
  form.slot = form.slot === label ? '' : label
}

const submit = async () => {
  if (!form.pseudo || !form.email || !form.slot || !form.trackUrl) {
    error.value = 'Veuillez remplir tous les champs obligatoires (dont le créneau).'
    return
  }
  if (isSlotTaken(form.slot)) {
    error.value = 'Ce créneau est déjà pris. Veuillez en choisir un autre.'
    return
  }
  sending.value = true
  error.value = ''
  try {
    await create('freestyles', {
      pseudo: form.pseudo,
      email: form.email,
      socialLinks: form.socialLinks,
      slot: form.slot,
      trackUrl: form.trackUrl,
      message: form.message,
      status: 'pending',
    })
    sent.value = true
    Object.assign(form, { pseudo: '', email: '', socialLinks: '', slot: '', trackUrl: '', message: '' })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="py-12">
    <div class="mx-auto max-w-5xl px-4 lg:px-8">
      <h1 class="section-title gradient-text">Réservation freestyles</h1>
      <p class="mt-2 text-gray-400">
        Réservez votre créneau pour performer en direct lors des freestyles nocturnes du 28 juin.
      </p>

      <!-- Infos pratiques -->
      <div class="mt-8 grid gap-4 sm:grid-cols-3">
        <div class="card-glow p-5">
          <h2 class="font-semibold text-white">Infos pratiques</h2>
          <ul class="mt-3 space-y-1.5 text-sm text-gray-400">
            <li>📅 Nuit du 27 au 28 juin</li>
            <li>⏰ De 03h00 à 10h29</li>
            <li>⏱️ ~8 minutes par passage</li>
          </ul>
        </div>
        <div class="card-glow p-5">
          <h2 class="font-semibold text-white">Comment ça marche ?</h2>
          <ol class="mt-3 space-y-1.5 text-sm text-gray-400 list-decimal list-inside">
            <li>Choisissez un créneau libre</li>
            <li>Remplissez le formulaire</li>
            <li>Validation par l'organisateur</li>
          </ol>
        </div>
        <div class="card-glow p-5 flex flex-col justify-center text-center">
          <p class="text-3xl font-bold text-accent-green">{{ availableCount }}</p>
          <p class="text-sm text-gray-400">créneaux disponibles sur {{ slots.length }}</p>
        </div>
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-5">
      <!-- Colonne gauche : grille cliquable -->
      <div class="card-glow p-6 lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="font-display text-lg font-bold text-white">Choisissez votre créneau</h2>
        </div>
        <div class="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
          <span class="flex items-center gap-1"><span class="h-3 w-3 rounded bg-accent-green/20 border border-accent-green/40" /> Libre</span>
          <span class="flex items-center gap-1"><span class="h-3 w-3 rounded bg-primary" /> Sélectionné</span>
          <span class="flex items-center gap-1"><span class="h-3 w-3 rounded bg-accent-rose/20 border border-accent-rose/40" /> Pris</span>
        </div>

        <div v-if="slotsLoading || bookingsLoading" class="mt-4 h-48 animate-pulse rounded-lg bg-white/5" />
        <div v-else class="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-2">
          <button
            v-for="slot in slots"
            :key="slot.id"
            type="button"
            :disabled="isSlotTaken(slot.label)"
            class="rounded px-1 py-1.5 text-center text-xs font-medium transition"
            :class="[
              isSlotTaken(slot.label)
                ? 'cursor-not-allowed bg-accent-rose/15 text-accent-rose line-through'
                : form.slot === slot.label
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-accent-green/10 text-accent-green hover:bg-accent-green/20',
            ]"
            @click="selectSlot(slot.label)"
          >
            {{ slot.label }}
          </button>
        </div>
        <p v-if="!slotsLoading && slots.length === 0" class="mt-4 text-center text-gray-400">
          Aucun créneau disponible pour le moment.
        </p>
      </div>

      <!-- Colonne droite : formulaire -->
      <div class="lg:col-span-3">
      <div v-if="sent" class="card-glow p-8 text-center">
        <div class="text-5xl">🎤</div>
        <h2 class="mt-4 font-display text-xl font-bold text-white">Inscription reçue !</h2>
        <p class="mt-2 text-gray-400">
          Votre demande est en attente de validation. Vous recevrez un e-mail de confirmation
          une fois votre morceau validé par l'organisateur.
        </p>
        <PrimaryButton class="mt-6" variant="outline" @click="sent = false">
          Soumettre une autre inscription
        </PrimaryButton>
      </div>

      <form v-else class="card-glow p-8 space-y-5" @submit.prevent="submit">
        <h2 class="font-display text-xl font-bold text-white">Vos informations</h2>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Nom / Pseudo <span class="text-accent-rose">*</span>
            </label>
            <input
              v-model="form.pseudo"
              type="text"
              required
              placeholder="Votre nom de scène"
              class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              E-mail <span class="text-accent-rose">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="votre@email.com"
              class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Réseaux sociaux</label>
          <input
            v-model="form.socialLinks"
            type="text"
            placeholder="@instagram, @tiktok, lien SoundCloud..."
            class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Créneau souhaité <span class="text-accent-rose">*</span>
          </label>
          <select
            v-model="form.slot"
            required
            class="w-full rounded-lg border border-white/10 bg-surface-elevated px-4 py-2.5 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="">-- Choisir un créneau (ou cliquez dans la grille) --</option>
            <option
              v-for="slot in slots"
              :key="slot.id"
              :value="slot.label"
              :disabled="isSlotTaken(slot.label)"
            >
              {{ slot.label }}{{ isSlotTaken(slot.label) ? ' — Pris' : '' }}
            </option>
          </select>
          <p v-if="form.slot" class="mt-1 text-xs text-accent-green">
            Créneau sélectionné : {{ form.slot }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Lien vers votre morceau / exclu <span class="text-accent-rose">*</span>
          </label>
          <input
            v-model="form.trackUrl"
            type="url"
            required
            placeholder="https://soundcloud.com/... ou YouTube, Instagram..."
            class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <p class="mt-1 text-xs text-gray-500">
            Partagez un lien vers le morceau que vous souhaitez performer (SoundCloud, YouTube, Spotify…)
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Message libre</label>
          <textarea
            v-model="form.message"
            rows="3"
            placeholder="Présentation, contexte du morceau, infos supplémentaires..."
            class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <p class="text-xs text-gray-500">
          En soumettant ce formulaire, vous acceptez que vos informations soient traitées par PDS Records
          dans le cadre de l'organisation de l'événement, conformément à notre
          <NuxtLink to="/confidentialite" class="text-primary-light hover:underline">politique de confidentialité</NuxtLink>.
        </p>

        <p v-if="error" class="text-sm text-accent-rose">{{ error }}</p>

        <PrimaryButton type="submit" :disabled="sending" class="w-full">
          {{ sending ? 'Envoi en cours…' : 'Soumettre mon inscription' }}
        </PrimaryButton>
      </form>
      </div>
      </div>
    </div>
  </div>
</template>
