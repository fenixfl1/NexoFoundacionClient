import { create } from 'zustand'

interface UseGeneralStore {
  title: string
  setTitle: (title: string) => void
}

export const useGeneralStore = create<UseGeneralStore>((set) => ({
  title: '',
  setTitle: (title) => set({ title }),
}))
