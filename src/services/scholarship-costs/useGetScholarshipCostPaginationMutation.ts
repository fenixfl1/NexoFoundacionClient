import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { ScholarshipCost } from './scholarship-cost.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_SCHOLARSHIP_COST_PAGINATION } from 'src/constants/routes'
import { useScholarshipCostStore } from 'src/store/scholarship-cost.store'

const initialData: ReturnPayload<ScholarshipCost> = {
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

export function useGetScholarshipCostPaginationMutation() {
  const { setCosts } = useScholarshipCostStore()

  return useCustomMutation<
    ReturnPayload<ScholarshipCost>,
    GetPayload<ScholarshipCost>
  >({
    initialData,
    mutationKey: ['scholarship-costs', 'get-pagination'],
    onSuccess: setCosts,
    onError: () => setCosts(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<ScholarshipCost[]>(
        getQueryString(API_PATH_GET_SCHOLARSHIP_COST_PAGINATION, {
          page,
          size,
        }),
        condition
      )

      return data || initialData
    },
  })
}
