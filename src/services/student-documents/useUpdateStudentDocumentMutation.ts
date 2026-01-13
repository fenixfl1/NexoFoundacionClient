import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { StudentDocument } from './student-document.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_STUDENT_DOCUMENT } from 'src/constants/routes'

export function useUpdateStudentDocumentMutation() {
  return useCustomMutation<StudentDocument, StudentDocument>({
    initialData: <StudentDocument>{},
    mutationKey: ['student-documents', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<StudentDocument>(
        API_PATH_CREATE_UPDATE_STUDENT_DOCUMENT,
        payload
      )

      return data
    },
  })
}
