import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { Catalog } from './catalog.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_CATALOG_PAGINATION } from 'src/constants/routes'
import { useCatalogStore } from 'src/store/catalog.store'

const initialData: ReturnPayload<Catalog> = {
  data: [],
  metadata: {
    pagination: {
      count: 0,
      currentPage: 1,
      pageSize: 15,
      totalPages: 1,
      totalRows: 0,
      links: undefined,
    },
  },
}

export function useGetCataloguePaginationMutation() {
  const { setCatalogList } = useCatalogStore()

  return useCustomMutation<ReturnPayload<Catalog>, GetPayload<Catalog>>({
    initialData,
    mutationKey: ['catalog', 'get-catalog-pagination'],
    onSuccess: setCatalogList,
    onError: () => setCatalogList(initialData),
    mutationFn: async ({ condition, ...searchParams }) => {
      const { data } = await postRequest<Catalog[]>(
        getQueryString(API_PATH_GET_CATALOG_PAGINATION, { ...searchParams }),
        condition
      )

      return data || initialData
    },
  })
}
