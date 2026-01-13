import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_REQUEST } from 'src/constants/routes'
import {
  CreateRequestPayload,
  RequestRecord,
} from 'src/services/requests/request.types'

export function useCreateRequestMutation() {
  return useCustomMutation<RequestRecord, CreateRequestPayload>({
    initialData: <RequestRecord>{},
    mutationKey: ['requests', 'create-request'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<RequestRecord>(
        API_PATH_CREATE_UPDATE_REQUEST,
        payload
      )

      return data
    },
  })
}
