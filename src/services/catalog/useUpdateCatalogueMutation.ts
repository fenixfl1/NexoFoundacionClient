import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Catalog } from './catalog.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_CATALOG } from 'src/constants/routes'

export function useUpdateCatalogueMutation() {
  return useCustomMutation<Catalog, Partial<Catalog>>({
    initialData: <Catalog>{},
    mutationKey: ['catalog', 'update-catalog'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<Catalog>(API_PATH_CREATE_UPDATE_CATALOG, payload)

      return data
    },
  })
}
