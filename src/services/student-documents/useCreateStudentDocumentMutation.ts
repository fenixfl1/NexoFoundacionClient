import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { StudentDocument, StudentDocumentPayload } from './student-document.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_STUDENT_DOCUMENT } from 'src/constants/routes'

export function useCreateStudentDocumentMutation() {
  return useCustomMutation<StudentDocument, StudentDocumentPayload>({
    initialData: <StudentDocument>{},
    mutationKey: ['student-documents', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<StudentDocument>(
        API_PATH_CREATE_UPDATE_STUDENT_DOCUMENT,
        payload
      )

      return data
    },
  })
}
