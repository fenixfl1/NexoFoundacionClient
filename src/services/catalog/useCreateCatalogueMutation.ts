import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Catalog } from './catalog.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_CATALOG } from 'src/constants/routes'

export function useCreateCatalogueMutation() {
  return useCustomMutation<Catalog, Catalog>({
    initialData: <Catalog>{},
    mutationKey: ['catalog', 'create-catalog'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Catalog>(API_PATH_CREATE_UPDATE_CATALOG, payload)

      return data
    },
  })
}
