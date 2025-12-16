import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { RequestItem } from './request.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_REQUEST_PAGINATION } from 'src/constants/routes'
import { useRequestStore } from 'src/store/requests.store'

const initialData: ReturnPayload<RequestItem> = {
  data: [],
  metadata: {
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalRows: 0,
      count: 0,
      pageSize: 10,
      links: undefined,
    },
  },
}

export function useGetRequestPaginationMutation() {
  const { setRequests } = useRequestStore()

  return useCustomMutation<ReturnPayload<RequestItem>, GetPayload<RequestItem>>({
    initialData,
    mutationKey: ['requests', 'get-pagination'],
    onSuccess: setRequests,
    onError: () => setRequests(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<RequestItem[]>(
        getQueryString(API_PATH_GET_REQUEST_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
