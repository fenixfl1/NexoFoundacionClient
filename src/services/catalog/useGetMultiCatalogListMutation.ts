import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { postRequest } from '../api'
import { API_PATH_GET_CATALOG_LIST } from 'src/constants/routes'
import { MultiCatalog } from './catalog.types'
import { useCatalogStore } from 'src/store/catalog.store'

interface GetMultiCatalogPayload {
  [key: string]: number | string
}

export function useGetMultiCatalogListMutation() {
  const { setMultiCatalogList } = useCatalogStore()

  return useCustomMutation<MultiCatalog, GetMultiCatalogPayload>({
    initialData: <MultiCatalog>{},
    mutationKey: ['catalog', 'get-multi-catalog-list'],
    onSuccess: setMultiCatalogList,
    onError: () => setMultiCatalogList({}),
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<MultiCatalog>(API_PATH_GET_CATALOG_LIST, payload)

      return data
    },
  })
}
