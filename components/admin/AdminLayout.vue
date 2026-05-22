<template>
  <div class="flex min-h-screen bg-gray-50">
    <AdminSidebar />
    <div class="flex flex-1 flex-col">
      <AdminTopbar>
        <template v-if="$slots.title" #title>
          <slot name="title" />
        </template>
      </AdminTopbar>
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
