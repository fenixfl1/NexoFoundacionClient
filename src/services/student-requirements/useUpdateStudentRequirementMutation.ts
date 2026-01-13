import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { StudentRequirement } from './student-requirement.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_STUDENT_REQUIREMENT } from 'src/constants/routes'

export function useUpdateStudentRequirementMutation() {
  return useCustomMutation<StudentRequirement, StudentRequirement>({
    initialData: <StudentRequirement>{},
    mutationKey: ['student-requirements', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<StudentRequirement>(
        API_PATH_CREATE_UPDATE_STUDENT_REQUIREMENT,
        payload
      )

      return data
    },
  })
}
