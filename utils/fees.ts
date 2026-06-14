/**
 * Frais de transaction Stripe (carte européenne) : 1,5 % + 0,25 €.
 * ⚠️ Gardez ce fichier synchronisé avec server/utils/fees.ts.
 */
export const STRIPE_FEE_PERCENT = 0.015
export const STRIPE_FEE_FIXED_CENTS = 25

/**
 * Montant (en centimes) à ajouter pour que l'association reçoive 100 % du don.
 * Brut G tel que net = don : G = (don + fixe) / (1 − pourcentage).
 */
export function coverFeeCents(amountCents: number): number {
  if (!Number.isFinite(amountCents) || amountCents <= 0) return 0
  const gross = (amountCents + STRIPE_FEE_FIXED_CENTS) / (1 - STRIPE_FEE_PERCENT)
  // Calcul réel arrondi au centime le plus proche (Stripe ne facture pas de sous-centime)
  return Math.max(0, Math.round(gross - amountCents))
}
