import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Sponsor, SponsorPayload } from './sponsor.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_SPONSOR } from 'src/constants/routes'

export function useCreateSponsorMutation() {
  return useCustomMutation<Sponsor, SponsorPayload>({
    initialData: <Sponsor>{},
    mutationKey: ['sponsors', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Sponsor>(
        API_PATH_CREATE_UPDATE_SPONSOR,
        payload
      )

      return data
    },
  })
}
