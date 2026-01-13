import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import {
  StudentRequirement,
  StudentRequirementPayload,
} from './student-requirement.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_STUDENT_REQUIREMENT } from 'src/constants/routes'

export function useCreateStudentRequirementMutation() {
  return useCustomMutation<StudentRequirement, StudentRequirementPayload>({
    initialData: <StudentRequirement>{},
    mutationKey: ['student-requirements', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<StudentRequirement>(
        API_PATH_CREATE_UPDATE_STUDENT_REQUIREMENT,
        payload
      )

      return data
    },
  })
}
