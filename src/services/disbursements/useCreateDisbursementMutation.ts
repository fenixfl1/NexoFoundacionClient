import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Disbursement, DisbursementPayload } from './disbursement.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_DISBURSEMENT } from 'src/constants/routes'

export function useCreateDisbursementMutation() {
  return useCustomMutation<Disbursement, DisbursementPayload>({
    initialData: <Disbursement>{},
    mutationKey: ['disbursements', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Disbursement>(
        API_PATH_CREATE_UPDATE_DISBURSEMENT,
        payload
      )

      return data
    },
  })
}
