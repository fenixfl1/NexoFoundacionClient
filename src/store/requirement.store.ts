import { create } from 'zustand'
import { Metadata, ReturnPayload } from 'src/types/general'
import { Requirement } from 'src/services/requirements/requirement.types'

const defaultMetadata: Metadata = {
  currentPage: 1,
  totalPages: 0,
  totalRows: 0,
  count: 0,
  pageSize: 10,
  links: undefined,
}

interface UseRequirementStore {
  requirements: Requirement[]
  metadata: Metadata
  setRequirements: (payload: ReturnPayload<Requirement>) => void
}

export const useRequirementStore = create<UseRequirementStore>((set) => ({
  requirements: [],
  metadata: defaultMetadata,
  setRequirements: ({ data, metadata }) =>
    set({
      requirements: data,
      metadata: metadata?.pagination ?? defaultMetadata,
    }),
}))
