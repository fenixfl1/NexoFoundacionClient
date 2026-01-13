import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { FollowUp } from './follow-up.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_FOLLOW_UP_PAGINATION } from 'src/constants/routes'
import { useFollowUpStore } from 'src/store/follow-up.store'

const initialData: ReturnPayload<FollowUp> = {
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

export function useGetFollowUpPaginationMutation() {
  const { setFollowUps } = useFollowUpStore()

  return useCustomMutation<ReturnPayload<FollowUp>, GetPayload<FollowUp>>({
    initialData,
    mutationKey: ['follow-ups', 'get-pagination'],
    onSuccess: setFollowUps,
    onError: () => setFollowUps(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<FollowUp[]>(
        getQueryString(API_PATH_GET_FOLLOW_UP_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
