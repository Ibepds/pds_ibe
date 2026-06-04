<script setup lang="ts">
import { FREESTYLE_SLOTS, MOCK_FREESTYLE_BOOKINGS } from '~/utils/mockData'
import type { FreestyleBooking } from '~/types'

useHead({ title: 'Réservation freestyles — PDS Humanity' })

const { data: bookings, loading: bookingsLoading } = useFirestoreCollection(
  'freestyles',
  MOCK_FREESTYLE_BOOKINGS,
)

const { create } = useAdminFirestore()

// Slots taken (pending or validated only)
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

const isSlotTaken = (slot: string) => takenSlots.value.includes(slot)

const availableCount = computed(
  () => FREESTYLE_SLOTS.length - takenSlots.value.length,
)

const submit = async () => {
  if (!form.pseudo || !form.email || !form.slot || !form.trackUrl) {
    error.value = 'Veuillez remplir tous les champs obligatoires.'
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

      <div class="mt-8 grid gap-8 lg:grid-cols-5">
        <!-- Info colonne -->
        <div class="space-y-5 lg:col-span-2">
          <div class="card-glow p-6">
            <h2 class="font-semibold text-white">Comment ça marche ?</h2>
            <ol class="mt-3 space-y-2 text-sm text-gray-400 list-decimal list-inside">
              <li>Choisissez un créneau disponible (6 min chacun)</li>
              <li>Remplissez le formulaire avec un lien vers votre morceau</li>
              <li>L'organisateur valide votre participation</li>
              <li>Vous recevez une confirmation par e-mail</li>
            </ol>
          </div>

          <div class="card-glow p-6">
            <h2 class="font-semibold text-white">Infos pratiques</h2>
            <ul class="mt-3 space-y-2 text-sm text-gray-400">
              <li>📅 <strong class="text-white">Date :</strong> nuit du 27 au 28 juin</li>
              <li>⏰ <strong class="text-white">Horaires :</strong> 4h00 → 8h54</li>
              <li>⏱️ <strong class="text-white">Durée :</strong> ~6 minutes par créneau</li>
              <li>🎤 <strong class="text-white">50 créneaux</strong> disponibles</li>
            </ul>
          </div>

          <div class="card-glow p-6">
            <div class="flex items-center justify-between">
              <h2 class="font-semibold text-white">Disponibilités</h2>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="availableCount > 0 ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-rose/20 text-accent-rose'"
              >
                {{ availableCount }} / {{ FREESTYLE_SLOTS.length }} libres
              </span>
            </div>
            <div v-if="bookingsLoading" class="mt-3 h-32 animate-pulse rounded-lg bg-white/5" />
            <div v-else class="mt-3 grid grid-cols-5 gap-1">
              <div
                v-for="slot in FREESTYLE_SLOTS"
                :key="slot"
                class="rounded px-1 py-1 text-center text-xs font-mono"
                :class="
                  isSlotTaken(slot)
                    ? 'bg-accent-rose/20 text-accent-rose line-through'
                    : 'bg-accent-green/10 text-accent-green'
                "
                :title="isSlotTaken(slot) ? 'Créneau pris' : 'Créneau disponible'"
              >
                {{ slot }}
              </div>
            </div>
          </div>
        </div>

        <!-- Formulaire -->
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
            <h2 class="font-display text-xl font-bold text-white">Formulaire d'inscription</h2>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">
                Nom / Pseudo <span class="text-accent-rose">*</span>
              </label>
              <input
                v-model="form.pseudo"
                type="text"
                required
                placeholder="Votre pseudo ou nom de scène"
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
                <option value="">-- Choisir un créneau --</option>
                <option
                  v-for="slot in FREESTYLE_SLOTS"
                  :key="slot"
                  :value="slot"
                  :disabled="isSlotTaken(slot)"
                >
                  {{ slot }}{{ isSlotTaken(slot) ? ' — Pris' : '' }}
                </option>
              </select>
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
              dans le cadre de l'organisation de l'événement.
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
