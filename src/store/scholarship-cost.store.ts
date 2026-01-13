import { create } from 'zustand'
import { Metadata, ReturnPayload } from 'src/types/general'
import { ScholarshipCost } from 'src/services/scholarship-costs/scholarship-cost.types'

const defaultMetadata: Metadata = {
  currentPage: 1,
  totalPages: 0,
  totalRows: 0,
  count: 0,
  pageSize: 10,
  links: undefined,
}

interface UseScholarshipCostStore {
  costs: ScholarshipCost[]
  metadata: Metadata
  setCosts: (payload: ReturnPayload<ScholarshipCost>) => void
}

export const useScholarshipCostStore = create<UseScholarshipCostStore>(
  (set) => ({
    costs: [],
    metadata: defaultMetadata,
    setCosts: ({ data, metadata }) =>
      set({
        costs: data,
        metadata: metadata?.pagination ?? defaultMetadata,
      }),
  })
)
