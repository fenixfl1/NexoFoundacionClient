import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { CatalogItem } from './catalog.types'
import { putRequest } from '../api'
import { API_PATH_UPDATE_CATALOG_ITEM } from 'src/constants/routes'
import { generatePath } from 'react-router-dom'

interface UpdateCatalogItemPayload {
  catalogId: number
  itemId: number
  values: Partial<Omit<CatalogItem, 'CATALOG_ID' | 'ITEM_ID'>>
}

export function useUpdateCatalogItemMutation() {
  return useCustomMutation<Partial<CatalogItem>, UpdateCatalogItemPayload>({
    initialData: <CatalogItem>{},
    mutationKey: ['catalog', 'update-catalog-item'],
    mutationFn: async ({ catalogId, itemId, values }) => {
      const {
        data: { data },
      } = await putRequest<CatalogItem>(
        generatePath(API_PATH_UPDATE_CATALOG_ITEM, {
          catalogId: String(catalogId),
          itemId: String(itemId),
        }),
        values
      )

      return data
    },
  })
}
