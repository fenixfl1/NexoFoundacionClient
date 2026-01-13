import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { FollowUp, FollowUpPayload } from './follow-up.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_FOLLOW_UP } from 'src/constants/routes'

export function useCreateFollowUpMutation() {
  return useCustomMutation<FollowUp, FollowUpPayload>({
    initialData: <FollowUp>{},
    mutationKey: ['follow-ups', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<FollowUp>(
        API_PATH_CREATE_UPDATE_FOLLOW_UP,
        payload
      )

      return data
    },
  })
}
