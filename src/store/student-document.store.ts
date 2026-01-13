import { create } from 'zustand'
import { Metadata, ReturnPayload } from 'src/types/general'
import { StudentDocument } from 'src/services/student-documents/student-document.types'

const defaultMetadata: Metadata = {
  currentPage: 1,
  totalPages: 0,
  totalRows: 0,
  count: 0,
  pageSize: 10,
  links: undefined,
}

interface UseStudentDocumentStore {
  documents: StudentDocument[]
  metadata: Metadata
  setDocuments: (payload: ReturnPayload<StudentDocument>) => void
}

export const useStudentDocumentStore = create<UseStudentDocumentStore>(
  (set) => ({
    documents: [],
    metadata: defaultMetadata,
    setDocuments: ({ data, metadata }) =>
      set({
        documents: data,
        metadata: metadata?.pagination ?? defaultMetadata,
      }),
  })
)
