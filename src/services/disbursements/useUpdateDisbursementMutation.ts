import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Disbursement } from './disbursement.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_DISBURSEMENT } from 'src/constants/routes'

export function useUpdateDisbursementMutation() {
  return useCustomMutation<Disbursement, Disbursement>({
    initialData: <Disbursement>{},
    mutationKey: ['disbursements', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<Disbursement>(
        API_PATH_CREATE_UPDATE_DISBURSEMENT,
        payload
      )

      return data
    },
  })
}
