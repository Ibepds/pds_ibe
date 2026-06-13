<script setup lang="ts">
import { MOCK_FREESTYLE_SLOTS, MOCK_FREESTYLE_BOOKINGS } from '~/utils/mockData'
import { DA } from '~/utils/daAssets'

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
  <div class="home-container">
    <section class="py-12 md:py-16">
      <PageHeader
        title="Réservation freestyles"
        lead="Réservez votre créneau pour performer en direct lors des freestyles nocturnes du 28 juin."
      />
    </section>

    <section class="section-divider py-12 md:py-16">
      <div class="grid gap-8 sm:grid-cols-3">
        <div v-reveal>
          <h2 class="font-display text-sm font-bold uppercase text-white">Infos pratiques</h2>
          <ul class="mt-3 space-y-1.5 text-sm text-white/60">
            <li>📅 Nuit du 27 au 28 juin</li>
            <li>⏰ De 03h00 à 10h29</li>
            <li>⏱️ ~8 minutes par passage</li>
          </ul>
        </div>
        <div v-reveal>
          <h2 class="font-display text-sm font-bold uppercase text-white">Comment ça marche ?</h2>
          <ol class="mt-3 list-inside list-decimal space-y-1.5 text-sm text-white/60">
            <li>Choisissez un créneau libre</li>
            <li>Remplissez le formulaire</li>
            <li>Validation par l'organisateur</li>
          </ol>
        </div>
        <div v-reveal class="text-center sm:text-left">
          <p class="font-display text-4xl font-bold text-accent-green">{{ availableCount }}</p>
          <p class="text-sm text-white/60">créneaux disponibles sur {{ slots.length }}</p>
        </div>
      </div>
    </section>

    <section class="section-divider py-12 md:py-16">
      <div class="grid gap-12 lg:grid-cols-5">
        <div v-reveal class="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
          <h2 class="section-heading !justify-start">
            <ChalkHeart />
            Choisissez votre créneau
          </h2>
          <div class="mt-4 flex flex-wrap gap-3 text-xs text-white/60">
            <span class="flex items-center gap-1"><span class="h-3 w-3 border border-accent-green/60 bg-accent-green/20" /> Libre</span>
            <span class="flex items-center gap-1"><span class="h-3 w-3 border border-white bg-white" /> Sélectionné</span>
            <span class="flex items-center gap-1"><span class="h-3 w-3 border border-accent-red/60 bg-accent-red/20" /> Pris</span>
          </div>

          <div v-if="slotsLoading || bookingsLoading" class="mt-4 h-48 animate-pulse bg-white/10" />
          <div v-else class="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-2">
            <button
              v-for="slot in slots"
              :key="slot.id"
              type="button"
              :disabled="isSlotTaken(slot.label)"
              class="px-1 py-1.5 text-center text-xs font-bold uppercase transition"
              :class="[
                isSlotTaken(slot.label)
                  ? 'cursor-not-allowed border border-accent-red/40 bg-accent-red/15 text-accent-red line-through'
                  : form.slot === slot.label
                    ? 'border-2 border-white bg-white text-primary'
                    : 'border border-accent-green/40 bg-accent-green/10 text-accent-green hover:bg-accent-green/20',
              ]"
              @click="selectSlot(slot.label)"
            >
              {{ slot.label }}
            </button>
          </div>
          <p v-if="!slotsLoading && slots.length === 0" class="mt-4 text-center text-white/60">
            Aucun créneau disponible pour le moment.
          </p>
        </div>

        <div class="lg:col-span-3">
          <div v-if="sent" v-reveal class="text-center">
            <ChalkImage :src="DA.picto.trophy" class="mx-auto h-16 w-16" />
            <h2 class="mt-4 font-display text-xl font-bold uppercase text-white">Inscription reçue !</h2>
            <p class="mt-2 text-white/60">
              Votre demande est en attente de validation. Vous recevrez un e-mail de confirmation
              une fois votre morceau validé par l'organisateur.
            </p>
            <PrimaryButton class="mt-6" variant="outline" @click="sent = false">
              Soumettre une autre inscription
            </PrimaryButton>
          </div>

          <form v-else v-reveal class="space-y-5" @submit.prevent="submit">
            <h2 class="section-heading !justify-start">
              <ChalkHeart />
              Vos informations
            </h2>

            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label class="form-label">
                  Nom / Pseudo <span class="text-accent-red">*</span>
                </label>
                <input v-model="form.pseudo" type="text" required placeholder="Votre nom de scène" class="input-field" />
              </div>
              <div>
                <label class="form-label">
                  E-mail <span class="text-accent-red">*</span>
                </label>
                <input v-model="form.email" type="email" required placeholder="votre@email.com" class="input-field" />
              </div>
            </div>

            <div>
              <label class="form-label">Réseaux sociaux</label>
              <input
                v-model="form.socialLinks"
                type="text"
                placeholder="@instagram, @tiktok, lien SoundCloud..."
                class="input-field"
              />
            </div>

            <div>
              <label class="form-label">
                Créneau souhaité <span class="text-accent-red">*</span>
              </label>
              <select v-model="form.slot" required class="input-field">
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
              <label class="form-label">
                Lien vers votre morceau / exclu <span class="text-accent-red">*</span>
              </label>
              <input
                v-model="form.trackUrl"
                type="url"
                required
                placeholder="https://soundcloud.com/... ou YouTube, Instagram..."
                class="input-field"
              />
              <p class="form-hint">
                Partagez un lien vers le morceau que vous souhaitez performer (SoundCloud, YouTube, Spotify…)
              </p>
            </div>

            <div>
              <label class="form-label">Message libre</label>
              <textarea
                v-model="form.message"
                rows="3"
                placeholder="Présentation, contexte du morceau, infos supplémentaires..."
                class="input-field"
              />
            </div>

            <p class="text-xs text-white/50">
              En soumettant ce formulaire, vous acceptez que vos informations soient traitées par PDS Records
              dans le cadre de l'organisation de l'événement, conformément à notre
              <NuxtLink to="/confidentialite" class="text-primary-light hover:underline">politique de confidentialité</NuxtLink>.
            </p>

            <p v-if="error" class="text-sm text-accent-red">{{ error }}</p>

            <PrimaryButton type="submit" :disabled="sending" class="w-full">
              {{ sending ? 'Envoi en cours…' : 'Soumettre mon inscription' }}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
