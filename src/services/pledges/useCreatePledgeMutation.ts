import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Pledge, PledgePayload } from './pledge.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_PLEDGE } from 'src/constants/routes'

export function useCreatePledgeMutation() {
  return useCustomMutation<Pledge, PledgePayload>({
    initialData: <Pledge>{},
    mutationKey: ['pledges', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Pledge>(
        API_PATH_CREATE_UPDATE_PLEDGE,
        payload
      )

      return data
    },
  })
}
