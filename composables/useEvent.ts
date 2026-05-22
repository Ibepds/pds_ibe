import type { EventDoc } from '~/types'
import { MOCK_EVENT } from '~/utils/mockData'

export function useEvent() {
  const { single, loading, error, usingMock, refresh } = useFirestoreCollection<
    EventDoc & { id: string }
  >('event', [{ id: 'main', ...MOCK_EVENT }], { docId: 'main' })

  return { event: single, loading, error, usingMock, refresh }
}
