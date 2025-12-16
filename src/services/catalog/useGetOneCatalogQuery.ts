import { useQuery } from '@tanstack/react-query'
import { getRequest } from '../api'
import { Catalog } from './catalog.types'
import { PATH_GET_CATALOG } from 'src/constants/routes'
import { useCatalogStore } from 'src/store/catalog.store'

export function useGetOneCatalogQuery(catalogId: number) {
  const { setCatalog } = useCatalogStore()

  return useQuery({
    enabled: !!catalogId,
    queryKey: ['catalog', 'get-one-catalog', catalogId],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<Catalog>(PATH_GET_CATALOG, catalogId)

      setCatalog(data)

      return data
    },
  })
}
