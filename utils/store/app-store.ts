import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  isElectionMode: boolean
  toggleElectionMode: () => void
  setElectionMode: (value: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isElectionMode: false,
      toggleElectionMode: () => set((state) => ({ isElectionMode: !state.isElectionMode })),
      setElectionMode: (value: boolean) => set({ isElectionMode: value }),
    }),
    {
      name: 'app-storage', // name of the item in the storage (must be unique)
    }
  )
)
