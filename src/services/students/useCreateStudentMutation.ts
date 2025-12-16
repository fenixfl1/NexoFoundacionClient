import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Student } from './student.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_STUDENT } from 'src/constants/routes'

export function useUpdateStudentMutation() {
  return useCustomMutation<Student, Student>({
    initialData: <Student>{},
    mutationKey: ['student', 'update-student'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<Student>(API_PATH_CREATE_UPDATE_STUDENT, payload)

      return data
    },
  })
}
