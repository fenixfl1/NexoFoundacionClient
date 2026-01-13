import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Pledge } from './pledge.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_PLEDGE } from 'src/constants/routes'

export function useUpdatePledgeMutation() {
  return useCustomMutation<Pledge, Pledge>({
    initialData: <Pledge>{},
    mutationKey: ['pledges', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<Pledge>(
        API_PATH_CREATE_UPDATE_PLEDGE,
        payload
      )

      return data
    },
  })
}
