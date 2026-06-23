import type { BattlesDoc } from '~/types'
import { MOCK_BATTLES } from '~/utils/mockData'

/** Contenu éditable de la section Battles (collection content/battles). */
export function useBattles() {
  const { single } = useFirestoreCollection<BattlesDoc & { id: string }>(
    'content',
    [{ id: 'battles', ...MOCK_BATTLES }],
    { docId: 'battles' },
  )
  // Toujours renvoyer un objet complet (valeurs par défaut si champ manquant)
  const battles = computed<BattlesDoc>(() => ({ ...MOCK_BATTLES, ...(single.value ?? {}) }))
  return { battles }
}
