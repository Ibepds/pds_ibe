/**
 * Frais de transaction — Stripe (carte EU) et PayPal (France).
 * ⚠️ Gardez ce fichier synchronisé avec server/utils/fees.ts.
 */
export type FeeProvider = 'stripe' | 'paypal'

export const STRIPE_FEE_PERCENT = 0.015
export const STRIPE_FEE_FIXED_CENTS = 25

/** PayPal France — paiement standard en EUR */
export const PAYPAL_FEE_PERCENT = 0.0349
export const PAYPAL_FEE_FIXED_CENTS = 35

const FEE_RATES: Record<FeeProvider, { percent: number; fixedCents: number }> = {
  stripe: { percent: STRIPE_FEE_PERCENT, fixedCents: STRIPE_FEE_FIXED_CENTS },
  paypal: { percent: PAYPAL_FEE_PERCENT, fixedCents: PAYPAL_FEE_FIXED_CENTS },
}

/** Libellé affiché sous le switch de paiement */
export function feeRateLabel(provider: FeeProvider): string {
  if (provider === 'stripe') return '1,5 % + 0,25 €'
  return '3,49 % + 0,35 €'
}

/**
 * Montant (en centimes) à ajouter pour que l'association reçoive 100 % du don.
 * Brut G tel que net = don : G = (don + fixe) / (1 − pourcentage).
 */
export function coverFeeCents(amountCents: number, provider: FeeProvider = 'paypal'): number {
  if (!Number.isFinite(amountCents) || amountCents <= 0) return 0
  const { percent, fixedCents } = FEE_RATES[provider]
  const gross = (amountCents + fixedCents) / (1 - percent)
  return Math.max(0, Math.round(gross - amountCents))
}
