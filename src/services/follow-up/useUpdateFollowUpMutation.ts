import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { FollowUp } from './follow-up.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_FOLLOW_UP } from 'src/constants/routes'

export function useUpdateFollowUpMutation() {
  return useCustomMutation<FollowUp, FollowUp>({
    initialData: <FollowUp>{},
    mutationKey: ['follow-ups', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<FollowUp>(API_PATH_CREATE_UPDATE_FOLLOW_UP, payload)

      return data
    },
  })
}
