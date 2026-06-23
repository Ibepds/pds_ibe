<script setup lang="ts">
usePageSeo({
  title: 'Assister aux battles — PDS Humanity',
  description:
    "Inscrivez-vous pour assister en tant que spectateur aux battles de PDS Humanity : Battle de DJ ou Battle Versus, en direct lors du marathon caritatif.",
})

const EVENTS = [
  { value: 'battle-dj', label: 'Battle de DJ', desc: 'Des DJ s\'affrontent aux platines, en direct.' },
  { value: 'versus', label: 'Battle Versus', desc: 'Le face-à-face scénique : un contre un.' },
] as const

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  event: '' as '' | 'battle-dj' | 'versus',
})

const sending = ref(false)
const sent = ref(false)
const error = ref('')

// Honeypot anti-bot (doit rester vide)
const hp = ref('')

const TEAM_EMAIL = 'alizee.grosjean@pdsrecords.com'
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

const { create } = useAdminFirestore()

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const eventLabel = (v: string) => EVENTS.find((e) => e.value === v)?.label ?? v

const submit = async () => {
  if (hp.value) {
    sent.value = true
    return
  }
  form.firstName = form.firstName.trim()
  form.lastName = form.lastName.trim()
  form.email = form.email.trim()

  if (!form.firstName || !form.lastName || !form.email || !form.event) {
    error.value = 'Veuillez remplir tous les champs et choisir un battle.'
    return
  }
  if (!EMAIL_RE.test(form.email)) {
    error.value = 'Veuillez saisir une adresse e-mail valide.'
    return
  }

  sending.value = true
  error.value = ''
  const label = eventLabel(form.event)
  try {
    await create('battleInscriptions', {
      lastName: form.lastName,
      firstName: form.firstName,
      email: form.email,
      event: form.event,
    })

    try {
      await create('mail', {
        to: TEAM_EMAIL,
        replyTo: form.email,
        message: {
          subject: `[Spectateur Battle] ${label}`,
          text:
            `Nouvelle inscription spectateur — PDS Humanity\n\n` +
            `Battle : ${label}\n` +
            `Nom : ${form.lastName}\n` +
            `Prénom : ${form.firstName}\n` +
            `E-mail : ${form.email}`,
          html:
            `<h2>Nouvelle inscription spectateur — Battle PDS Humanity</h2>` +
            `<p><strong>Battle :</strong> ${escapeHtml(label)}</p>` +
            `<p><strong>Nom :</strong> ${escapeHtml(form.lastName)}</p>` +
            `<p><strong>Prénom :</strong> ${escapeHtml(form.firstName)}</p>` +
            `<p><strong>E-mail :</strong> ${escapeHtml(form.email)}</p>`,
        },
      })
    } catch {
      /* notification e-mail optionnelle */
    }

    sent.value = true
    Object.assign(form, { firstName: '', lastName: '', email: '', event: '' })
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
        title="Assister aux battles"
        lead="Inscrivez-vous pour assister en spectateur aux battles, en direct lors du marathon."
      />
    </section>

    <section class="section-divider py-12 md:py-16">
      <div class="mx-auto max-w-xl">
        <div v-if="sent" v-reveal class="text-center">
          <ChalkHeart class="mx-auto !h-12 !w-12" />
          <h2 class="mt-4 font-display text-xl font-bold uppercase text-white">Inscription envoyée !</h2>
          <p class="mt-2 text-white/70">
            Merci, votre inscription a bien été reçue. L'équipe vous recontactera par e-mail.
          </p>
          <PrimaryButton class="mt-6" variant="outline" @click="sent = false">
            Inscrire une autre personne
          </PrimaryButton>
        </div>

        <form v-else v-reveal class="form-block-mobile space-y-5" @submit.prevent="submit">
          <!-- Honeypot anti-spam (caché) -->
          <input
            v-model="hp"
            type="text"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
            class="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <!-- Choix du battle -->
          <div>
            <label class="form-label">Battle auquel vous souhaitez assister <span class="text-accent-red">*</span></label>
            <div class="mt-2 grid gap-3 sm:grid-cols-2">
              <label
                v-for="ev in EVENTS"
                :key="ev.value"
                class="flex cursor-pointer flex-col gap-1 border-2 p-4 transition"
                :class="form.event === ev.value ? 'border-white bg-white/10' : 'border-white/35 hover:bg-white/5'"
              >
                <span class="flex items-center gap-2">
                  <input v-model="form.event" type="radio" :value="ev.value" class="h-4 w-4" />
                  <span class="font-display text-sm font-bold uppercase text-white">{{ ev.label }}</span>
                </span>
                <span class="text-xs text-white/60">{{ ev.desc }}</span>
              </label>
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="form-label">Prénom <span class="text-accent-red">*</span></label>
              <input v-model="form.firstName" type="text" required maxlength="80" placeholder="Votre prénom" class="input-field" />
            </div>
            <div>
              <label class="form-label">Nom <span class="text-accent-red">*</span></label>
              <input v-model="form.lastName" type="text" required maxlength="80" placeholder="Votre nom" class="input-field" />
            </div>
          </div>

          <div>
            <label class="form-label">E-mail <span class="text-accent-red">*</span></label>
            <input v-model="form.email" type="email" required maxlength="200" placeholder="votre@email.com" class="input-field" />
          </div>

          <p class="text-xs text-white/50">
            Vos données sont traitées uniquement pour gérer votre inscription, conformément à notre
            <NuxtLink to="/confidentialite" class="text-primary-light hover:underline">politique de confidentialité</NuxtLink>.
          </p>

          <p v-if="error" class="text-sm text-accent-red">{{ error }}</p>

          <PrimaryButton type="submit" :disabled="sending" class="w-full">
            {{ sending ? 'Envoi en cours…' : 'Confirmer mon inscription' }}
          </PrimaryButton>
        </form>
      </div>
    </section>
  </div>
</template>
