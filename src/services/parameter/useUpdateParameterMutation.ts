import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { putRequest } from '../api'
import {
  Parameter,
  UpdateParameterPayload,
} from 'src/services/parameter/parameter.types'
import { API_PATH_CREATE_UPDATE_PARAMETER } from 'src/constants/routes'

export function useUpdateParameterMutation() {
  return useCustomMutation<Parameter, UpdateParameterPayload>({
    initialData: <Parameter>{},
    mutationKey: ['parameters', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<Parameter>(API_PATH_CREATE_UPDATE_PARAMETER, payload)

      return data
    },
  })
}
