import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UsePersist {
  expandedState: Record<string, boolean | undefined>
  partiallyExpanded: () => boolean
  toggleAll: (state: boolean) => void
}

export const usePersist = create(
  persist<UsePersist>(
    (set, get) => ({
      expandedState: {},
      partiallyExpanded: () => {
        const { expandedState } = get()
        return Object.values(expandedState).some((value) => value)
      },
      toggleAll: (state) => {
        const { expandedState } = get()
        set({
          expandedState: Object.fromEntries(
            Object.keys(expandedState).map((area) => [area, state]),
          ),
        })
      },
    }),
    {
      name: 'local',
    },
  ),
)
