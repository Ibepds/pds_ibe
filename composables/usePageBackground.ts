export type BgVariant = 'blue' | 'dark' | 'white' | 'cyan'

/**
 * Définit le fond texturé de la page courante (parmi les 4 fonds PDS Humanity).
 * Le layout applique un voile adaptatif pour garder le texte blanc lisible,
 * y compris sur les fonds clairs (FOND°3 blanc, FOND°4 cyan).
 */
export function usePageBackground(variant: BgVariant) {
  const state = useState<BgVariant>('page-bg', () => 'dark')
  state.value = variant
}
