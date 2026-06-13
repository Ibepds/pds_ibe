<script setup lang="ts">
usePageSeo({
  title: 'Contact — PDS Humanity',
  description:
    "Contactez l'équipe de PDS Humanity : presse, partenariats ou informations générales sur l'événement caritatif.",
})

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const subjects = [
  'Demande presse / média',
  'Partenariat',
  'Information générale',
  'Autre',
]

const sending = ref(false)
const sent = ref(false)
const error = ref('')

const TEAM_EMAIL = 'alizee.grosjean@pdsrecords.com'

const { create } = useAdminFirestore()

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const send = async () => {
  if (!form.name || !form.email || !form.message) {
    error.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }
  sending.value = true
  error.value = ''
  const subject = form.subject || 'Information générale'
  try {
    await create('contacts', {
      name: form.name,
      email: form.email,
      subject,
      message: form.message,
    })

    try {
      await create('mail', {
        to: TEAM_EMAIL,
        replyTo: form.email,
        message: {
          subject: `[Contact PDS Humanity] ${subject}`,
          text:
            `Nom : ${form.name}\n` +
            `E-mail : ${form.email}\n` +
            `Objet : ${subject}\n\n` +
            `${form.message}`,
          html:
            `<h2>Nouveau message — PDS Humanity</h2>` +
            `<p><strong>Nom :</strong> ${escapeHtml(form.name)}</p>` +
            `<p><strong>E-mail :</strong> ${escapeHtml(form.email)}</p>` +
            `<p><strong>Objet :</strong> ${escapeHtml(subject)}</p>` +
            `<p><strong>Message :</strong></p>` +
            `<p style="white-space:pre-line">${escapeHtml(form.message)}</p>`,
        },
      })
    } catch {
      /* notification e-mail optionnelle */
    }

    sent.value = true
    Object.assign(form, { name: '', email: '', subject: '', message: '' })
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
        title="Contact"
        lead="Une question, une demande presse ou un projet de partenariat ?"
      />
    </section>

    <section class="section-divider py-12 md:py-16">
      <div class="grid gap-12 lg:grid-cols-3">
        <ul class="space-y-8 lg:col-span-1">
          <li v-reveal>
            <DaIcon icon="cgpt.sparkles" class="h-10 w-10" />
            <h3 class="mt-2 font-display text-sm font-bold uppercase text-white">Presse</h3>
            <p class="mt-1 text-sm text-white/60">Demandes d'accréditation, interviews, visuels.</p>
          </li>
          <li v-reveal>
            <DaIcon icon="picto.highFive" class="h-10 w-10" />
            <h3 class="mt-2 font-display text-sm font-bold uppercase text-white">Partenariats</h3>
            <p class="mt-1 text-sm text-white/60">Collaboration, sponsoring, mise en avant.</p>
          </li>
          <li v-reveal>
            <DaIcon icon="picto.heartSm" class="h-10 w-10" />
            <h3 class="mt-2 font-display text-sm font-bold uppercase text-white">Général</h3>
            <p class="mt-1 text-sm text-white/60">Toute autre question sur l'événement.</p>
          </li>
        </ul>

        <div class="lg:col-span-2">
          <div v-if="sent" v-reveal class="text-center">
            <ChalkHeart class="!h-10 !w-10" />
            <h2 class="mt-4 font-display text-xl font-bold uppercase text-white">Message envoyé !</h2>
            <p class="mt-2 text-white/60">Nous reviendrons vers vous dans les plus brefs délais.</p>
            <PrimaryButton class="mt-6" variant="outline" @click="sent = false">
              Envoyer un autre message
            </PrimaryButton>
          </div>

          <form v-else v-reveal class="space-y-5" @submit.prevent="send">
            <div>
              <label class="form-label">Nom / Pseudo <span class="text-accent-red">*</span></label>
              <input v-model="form.name" type="text" required placeholder="Votre nom" class="input-field" />
            </div>
            <div>
              <label class="form-label">E-mail <span class="text-accent-red">*</span></label>
              <input v-model="form.email" type="email" required placeholder="votre@email.com" class="input-field" />
            </div>
            <div>
              <label class="form-label">Objet</label>
              <select v-model="form.subject" class="input-field">
                <option value="">-- Choisir un objet --</option>
                <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">Message <span class="text-accent-red">*</span></label>
              <textarea
                v-model="form.message"
                required
                rows="5"
                placeholder="Votre message..."
                class="input-field"
              />
            </div>
            <p class="text-xs text-white/50">
              Vos données sont traitées uniquement pour répondre à votre demande, conformément à notre
              <NuxtLink to="/confidentialite" class="text-primary-light hover:underline">politique de confidentialité</NuxtLink>.
            </p>
            <p v-if="error" class="text-sm text-accent-red">{{ error }}</p>
            <PrimaryButton type="submit" :disabled="sending" class="w-full">
              {{ sending ? 'Envoi en cours…' : 'Envoyer le message' }}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
