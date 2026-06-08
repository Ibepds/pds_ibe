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

// Destinataire des notifications de contact (extension Firebase Trigger Email)
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
    // 1) Enregistrement du message (consultable dans l'admin)
    await create('contacts', {
      name: form.name,
      email: form.email,
      subject,
      message: form.message,
    })

    // 2) Notification e-mail via l'extension "Trigger Email from Firestore".
    //    L'extension surveille la collection `mail` et envoie l'e-mail.
    //    Une erreur ici (ex. extension non encore installée) ne doit pas
    //    bloquer l'utilisateur : le message est déjà sauvegardé.
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
      /* notification e-mail optionnelle — ignorée si indisponible */
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
  <div class="py-12">
    <div class="mx-auto max-w-3xl px-4 lg:px-8">
      <h1 class="section-title gradient-text">Contact</h1>
      <p class="mt-2 text-gray-400">Une question, une demande presse ou un projet de partenariat ?</p>

      <div class="mt-10 grid gap-8 lg:grid-cols-3">
        <div class="space-y-4 lg:col-span-1">
          <div class="card-glow p-5">
            <div class="text-2xl">📰</div>
            <h3 class="mt-2 font-semibold text-white">Presse</h3>
            <p class="mt-1 text-sm text-gray-400">Demandes d'accréditation, interviews, visuels.</p>
          </div>
          <div class="card-glow p-5">
            <div class="text-2xl">🤝</div>
            <h3 class="mt-2 font-semibold text-white">Partenariats</h3>
            <p class="mt-1 text-sm text-gray-400">Collaboration, sponsoring, mise en avant.</p>
          </div>
          <div class="card-glow p-5">
            <div class="text-2xl">💬</div>
            <h3 class="mt-2 font-semibold text-white">Général</h3>
            <p class="mt-1 text-sm text-gray-400">Toute autre question sur l'événement.</p>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div v-if="sent" class="card-glow p-8 text-center">
            <div class="text-5xl">✅</div>
            <h2 class="mt-4 font-display text-xl font-bold text-white">Message envoyé !</h2>
            <p class="mt-2 text-gray-400">Nous reviendrons vers vous dans les plus brefs délais.</p>
            <PrimaryButton class="mt-6" variant="outline" @click="sent = false">
              Envoyer un autre message
            </PrimaryButton>
          </div>

          <form v-else class="card-glow p-8 space-y-5" @submit.prevent="send">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Nom / Pseudo <span class="text-accent-rose">*</span></label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Votre nom"
                class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">E-mail <span class="text-accent-rose">*</span></label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="votre@email.com"
                class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Objet</label>
              <select
                v-model="form.subject"
                class="w-full rounded-lg border border-white/10 bg-surface-elevated px-4 py-2.5 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="">-- Choisir un objet --</option>
                <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Message <span class="text-accent-rose">*</span></label>
              <textarea
                v-model="form.message"
                required
                rows="5"
                placeholder="Votre message..."
                class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <p class="text-xs text-gray-500">
              Vos données sont traitées uniquement pour répondre à votre demande, conformément à notre
              <NuxtLink to="/confidentialite" class="text-primary-light hover:underline">politique de confidentialité</NuxtLink>.
            </p>
            <p v-if="error" class="text-sm text-accent-rose">{{ error }}</p>
            <PrimaryButton type="submit" :disabled="sending" class="w-full">
              {{ sending ? 'Envoi en cours…' : 'Envoyer le message' }}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
