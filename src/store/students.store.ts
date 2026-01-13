import { create } from 'zustand'
import { Metadata, ReturnPayload } from 'src/types/general'
import { Student } from 'src/services/students/student.types'

interface UseStudentStore {
  students: Student[]
  metadata: Metadata
  selected?: Student
  drawerOpen: boolean
  summary: Record<string, string | number>
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
  students: [],
  metadata: defaultMetadata,
  selected: undefined,
  summary: {},
  drawerOpen: false,
  openDrawer: (student) => set({ drawerOpen: true, selected: student }),
  closeDrawer: () => set({ drawerOpen: false, selected: undefined }),
  setStudents: ({ data: students, metadata }) =>
    set({
      students,
      metadata: metadata?.pagination ?? defaultMetadata,
      summary: metadata.summary,
    }),
}))
