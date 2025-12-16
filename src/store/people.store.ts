import { Person } from 'src/services/people/people.types'
import { Metadata, ReturnPayload } from 'src/types/general'
import { create } from 'zustand'

interface UsePeopleStore {
  person: Person
  peopleList: Person[]
  metadata: Metadata
  profileVisibilityState: boolean
  setProfileVisibilitySate: (state: boolean) => void
  setPeople: (payload: ReturnPayload<Person>) => void
  setPerson: (person: Person) => void
  reset: () => void
}

const initialState = {
  person: <Person>{},
  peopleList: [],
  profileVisibilityState: false,
  metadata: {
    currentPage: 1,
    pageSize: 15,
    count: 0,
    totalPages: 0,
    totalRows: 0,
    links: undefined,
  },
}

export const usePeopleStore = create<UsePeopleStore>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setProfileVisibilitySate: (state) => set({ profileVisibilityState: state }),
  setPerson: (person) => set({ person }),
  setPeople: ({ data, metadata }) =>
    set({ peopleList: data, metadata: metadata.pagination }),
}))
