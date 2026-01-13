import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Requirement, RequirementPayload } from './requirement.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_REQUIREMENT } from 'src/constants/routes'

export function useCreateRequirementMutation() {
  return useCustomMutation<Requirement, RequirementPayload>({
    initialData: <Requirement>{},
    mutationKey: ['requirements', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Requirement>(
        API_PATH_CREATE_UPDATE_REQUIREMENT,
        payload
      )

      return data
    },
  })
}
