import { useQuery } from '@tanstack/react-query'
import { getRequest } from '../api'
import { StudentDocument } from './student-document.types'
import { API_PATH_GET_STUDENT_DOCUMENT } from 'src/constants/routes'

export function useGetStudentDocumentQuery(documentId?: number, enabled = true) {
  return useQuery({
    queryKey: ['student-documents', 'get-one', documentId],
    enabled: Boolean(documentId && enabled),
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<StudentDocument>(
        API_PATH_GET_STUDENT_DOCUMENT,
        documentId
      )

      return data
    },
  })
}
