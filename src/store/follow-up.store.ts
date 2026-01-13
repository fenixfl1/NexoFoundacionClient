import { create } from 'zustand'
import { Metadata, ReturnPayload } from 'src/types/general'
import { FollowUp } from 'src/services/follow-up/follow-up.types'

const defaultMetadata: Metadata = {
  currentPage: 1,
  totalPages: 0,
  totalRows: 0,
  count: 0,
  pageSize: 10,
  links: undefined,
}

interface UseFollowUpStore {
  followUps: FollowUp[]
  metadata: Metadata
  setFollowUps: (payload: ReturnPayload<FollowUp>) => void
}

export const useFollowUpStore = create<UseFollowUpStore>((set) => ({
  followUps: [],
  metadata: defaultMetadata,
  setFollowUps: ({ data, metadata }) =>
    set({
      followUps: data,
      metadata: metadata?.pagination ?? defaultMetadata,
    }),
}))
