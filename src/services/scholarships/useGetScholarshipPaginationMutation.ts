import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { Scholarship } from './scholarship.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_SCHOLARSHIP_PAGINATION } from 'src/constants/routes'
import { useScholarshipStore } from 'src/store/scholarship.store'

const initialData: ReturnPayload<Scholarship> = {
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

export function useGetScholarshipPaginationMutation() {
  const { setScholarships } = useScholarshipStore()

  return useCustomMutation<
    ReturnPayload<Scholarship>,
    GetPayload<Scholarship>
  >({
    initialData,
    mutationKey: ['scholarships', 'get-pagination'],
    onSuccess: setScholarships,
    onError: () => setScholarships(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Scholarship[]>(
        getQueryString(API_PATH_GET_SCHOLARSHIP_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
