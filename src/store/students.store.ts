import { create } from 'zustand'
import { Metadata, ReturnPayload } from 'src/types/general'
import { Student } from 'src/services/students/student.types'

interface UseStudentStore {
  list: Student[]
  metadata: Metadata
  selected?: Student
  drawerOpen: boolean
  setStudents: (payload: ReturnPayload<Student>) => void
  openDrawer: (student?: Student) => void
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

export const useStudentStore = create<UseStudentStore>((set) => ({
  list: [],
  metadata: defaultMetadata,
  selected: undefined,
  drawerOpen: false,
  setStudents: ({ data, metadata }) =>
    set({
      list: data,
      metadata: metadata?.pagination ?? defaultMetadata,
    }),
  openDrawer: (student) => set({ drawerOpen: true, selected: student }),
  closeDrawer: () => set({ drawerOpen: false, selected: undefined }),
}))
