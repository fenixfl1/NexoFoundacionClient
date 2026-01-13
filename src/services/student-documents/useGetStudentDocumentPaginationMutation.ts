import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { StudentDocument } from './student-document.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_STUDENT_DOCUMENT_PAGINATION } from 'src/constants/routes'
import { useStudentDocumentStore } from 'src/store/student-document.store'

const initialData: ReturnPayload<StudentDocument> = {
  data: [],
  metadata: {
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalRows: 0,
      count: 0,
      pageSize: 10,
      links: undefined,
    },
  },
}

export function useGetStudentDocumentPaginationMutation() {
  const { setDocuments } = useStudentDocumentStore()

  return useCustomMutation<
    ReturnPayload<StudentDocument>,
    GetPayload<StudentDocument>
  >({
    initialData,
    mutationKey: ['student-documents', 'get-pagination'],
    onSuccess: setDocuments,
    onError: () => setDocuments(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<StudentDocument[]>(
        getQueryString(API_PATH_GET_STUDENT_DOCUMENT_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
