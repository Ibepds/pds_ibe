<script setup lang="ts">
const route = useRoute()

const links = [
  { to: '/admin', label: 'Tableau de bord', icon: '📊' },
  { to: '/admin/event', label: 'Événement', icon: '🎯' },
  { to: '/admin/presentation', label: 'Présentation', icon: '📝' },
  { to: '/admin/freestyles', label: 'Freestyles', icon: '🎤' },
  { to: '/admin/contacts', label: 'Messages', icon: '✉️' },
  { to: '/admin/emails', label: 'Suivi e-mails', icon: '📨' },
  { to: '/admin/creneaux', label: 'Créneaux', icon: '⏱️' },
  { to: '/admin/participants', label: 'Participants', icon: '👥' },
  { to: '/admin/planning', label: 'Planning', icon: '📅' },
  { to: '/admin/encheres', label: 'Enchères', icon: '🏆' },
  { to: '/admin/association', label: 'Associations', icon: '🏛️' },
  { to: '/admin/faq', label: 'FAQ', icon: '❓' },
  { to: '/admin/legal', label: 'Mentions légales', icon: '⚖️' },
  // Outil temporaire — supprimer cette ligne + pages/admin/seed.vue après init
  { to: '/admin/seed', label: 'Charger démo', icon: '📦' },
]
</script>

<template>
  <aside class="flex w-64 flex-col border-r border-gray-200 bg-white">
    <div class="border-b border-gray-200 p-6">
      <NuxtLink to="/admin" class="font-bold text-gray-900">PDS Humanity Admin</NuxtLink>
      <p class="text-xs text-gray-500">Gestion de l'événement</p>
    </div>
    <nav class="flex-1 space-y-1 p-4">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition"
        :class="
          route.path === link.to
            ? 'bg-primary/10 font-semibold text-primary'
            : 'text-gray-600 hover:bg-gray-100'
        "
      >
        <span>{{ link.icon }}</span>
        {{ link.label }}
      </NuxtLink>
    </nav>
    <div class="border-t border-gray-200 p-4">
      <NuxtLink to="/" class="text-sm text-gray-500 hover:text-primary">
        ← Retour au site
      </NuxtLink>
    </div>
  </aside>
</template>
