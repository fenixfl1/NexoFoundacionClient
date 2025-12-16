import { create } from 'zustand'
import { Metadata, ReturnPayload } from 'src/types/general'
import { RequestItem } from 'src/services/requests/request.types'

interface UseRequestStore {
  list: RequestItem[]
  metadata: Metadata
  selected?: RequestItem
  drawerOpen: boolean
  setRequests: (payload: ReturnPayload<RequestItem>) => void
  openDrawer: (request?: RequestItem) => void
  closeDrawer: () => void
}

const defaultMetadata: Metadata = {
  currentPage: 1,
  totalPages: 0,
  totalRows: 0,
  count: 0,
  pageSize: 10,
  links: undefined,
}

export const useRequestStore = create<UseRequestStore>((set) => ({
  list: [],
  metadata: defaultMetadata,
  selected: undefined,
  drawerOpen: false,
  setRequests: ({ data, metadata }) =>
    set({
      list: data,
      metadata: metadata?.pagination ?? defaultMetadata,
    }),
  openDrawer: (request) => set({ drawerOpen: true, selected: request }),
  closeDrawer: () => set({ drawerOpen: false, selected: undefined }),
}))
