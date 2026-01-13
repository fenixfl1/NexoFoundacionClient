import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Requirement } from './requirement.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_REQUIREMENT } from 'src/constants/routes'

export function useUpdateRequirementMutation() {
  return useCustomMutation<Requirement, Requirement>({
    initialData: <Requirement>{},
    mutationKey: ['requirements', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<Requirement>(
        API_PATH_CREATE_UPDATE_REQUIREMENT,
        payload
      )

      return data
    },
  })
}
