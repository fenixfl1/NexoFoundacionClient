import { create } from 'zustand'
import { Metadata, ReturnPayload } from 'src/types/general'
import { Sponsor } from 'src/services/sponsors/sponsor.types'

const defaultMetadata: Metadata = {
  currentPage: 1,
  totalPages: 0,
  totalRows: 0,
  count: 0,
  pageSize: 10,
  links: undefined,
}

interface UseSponsorStore {
  sponsors: Sponsor[]
  metadata: Metadata
  setSponsors: (payload: ReturnPayload<Sponsor>) => void
}

export const useSponsorStore = create<UseSponsorStore>((set) => ({
  sponsors: [],
  metadata: defaultMetadata,
  setSponsors: ({ data, metadata }) =>
    set({
      sponsors: data,
      metadata: metadata?.pagination ?? defaultMetadata,
    }),
}))
