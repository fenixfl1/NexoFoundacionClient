import {
  ActivityParameter,
  Parameter,
} from 'src/services/parameter/parameter.types'
import { Metadata, ReturnPayload } from 'src/types/general'
import { create } from 'zustand'

const metadata: Metadata = {
  count: 0,
  currentPage: 1,
  pageSize: 15,
  totalPages: 1,
  totalRows: 0,
  links: undefined,
}

interface UseParameterStore {
  activityParameter: ActivityParameter
  parameters: Parameter[]
  metadata: Metadata
  setActivityParameter: (parameters: ActivityParameter) => void
  setParameters: (payload: ReturnPayload<Parameter>) => void
}

export const useParameterStore = create<UseParameterStore>((set) => ({
  activityParameter: <ActivityParameter>{},
  metadata,
  parameters: [],
  setActivityParameter: (activityParameter) => set({ activityParameter }),
  setParameters: ({ data, metadata: { pagination } }) =>
    set({ parameters: data, metadata: pagination }),
}))
