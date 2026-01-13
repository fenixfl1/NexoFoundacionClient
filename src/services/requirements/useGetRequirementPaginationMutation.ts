import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { Requirement } from './requirement.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_REQUIREMENT_PAGINATION } from 'src/constants/routes'
import { useRequirementStore } from 'src/store/requirement.store'

const initialData: ReturnPayload<Requirement> = {
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

export function useGetRequirementPaginationMutation() {
  const { setRequirements } = useRequirementStore()

  return useCustomMutation<
    ReturnPayload<Requirement>,
    GetPayload<Requirement>
  >({
    initialData,
    mutationKey: ['requirements', 'get-pagination'],
    onSuccess: setRequirements,
    onError: () => setRequirements(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Requirement[]>(
        getQueryString(API_PATH_GET_REQUIREMENT_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
