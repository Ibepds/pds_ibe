<script setup lang="ts">
import { formatCurrencyPrecise } from '~/utils/format'

export interface OverlayAlertData {
  id: string
  username: string
  amount: number
  message: string
}

defineProps<{
  alert: OverlayAlertData
}>()
</script>

<template>
  <div class="alert-card">
    <div class="alert-heart">💙</div>
    <p class="alert-title">Nouveau don !</p>
    <p class="alert-line">
      <span class="alert-user">{{ alert.username }}</span>
      a donné
      <span class="alert-amount">{{ formatCurrencyPrecise(alert.amount) }}</span>
    </p>
    <p v-if="alert.message" class="alert-message">« {{ alert.message }} »</p>
  </div>
</template>

<style scoped>
.alert-card {
  text-align: center;
  color: #fff;
  background: rgba(5, 70, 160, 0.85);
  border: 4px solid #fff;
  border-radius: 1rem;
  padding: 2rem 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  max-width: 90vw;
}
.alert-heart {
  font-size: 3.5rem;
  line-height: 1;
}
.alert-title {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.alert-line {
  margin-top: 0.75rem;
  font-size: 2rem;
}
.alert-user {
  color: #3e78d6;
  font-weight: 700;
}
.alert-amount {
  color: #4ade80;
  font-weight: 700;
}
.alert-message {
  margin-top: 0.75rem;
  font-size: 1.25rem;
  font-style: italic;
  opacity: 0.9;
}
</style>
