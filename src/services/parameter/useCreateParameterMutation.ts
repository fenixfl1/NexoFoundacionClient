import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { postRequest } from '../api'
import {
  Parameter,
  ParameterPayload,
} from 'src/services/parameter/parameter.types'
import { API_PATH_CREATE_UPDATE_PARAMETER } from 'src/constants/routes'

export function useCreateParameterMutation() {
  return useCustomMutation<Parameter, ParameterPayload>({
    initialData: <Parameter>{},
    mutationKey: ['parameters', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Parameter>(API_PATH_CREATE_UPDATE_PARAMETER, payload)

      return data
    },
  })
}
