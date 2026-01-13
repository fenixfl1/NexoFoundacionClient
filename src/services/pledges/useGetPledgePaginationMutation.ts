import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { Pledge } from './pledge.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_PLEDGE_PAGINATION } from 'src/constants/routes'
import { usePledgeStore } from 'src/store/pledge.store'

const initialData: ReturnPayload<Pledge> = {
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
    summary: {},
  },
}

export function useGetPledgePaginationMutation() {
  const { setPledges } = usePledgeStore()

  return useCustomMutation<ReturnPayload<Pledge>, GetPayload<Pledge>>({
    initialData,
    mutationKey: ['pledges', 'get-pagination'],
    onSuccess: setPledges,
    onError: () => setPledges(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Pledge[]>(
        getQueryString(API_PATH_GET_PLEDGE_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
