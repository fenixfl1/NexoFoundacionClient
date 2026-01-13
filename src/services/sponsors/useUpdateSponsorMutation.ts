import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Sponsor } from './sponsor.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_SPONSOR } from 'src/constants/routes'

export function useUpdateSponsorMutation() {
  return useCustomMutation<Sponsor, Sponsor>({
    initialData: <Sponsor>{},
    mutationKey: ['sponsors', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<Sponsor>(
        API_PATH_CREATE_UPDATE_SPONSOR,
        payload
      )

      return data
    },
  })
}
