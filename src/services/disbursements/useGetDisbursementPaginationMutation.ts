import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { Disbursement } from './disbursement.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_DISBURSEMENT_PAGINATION } from 'src/constants/routes'
import { useDisbursementStore } from 'src/store/disbursement.store'

const initialData: ReturnPayload<Disbursement> = {
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

export function useGetDisbursementPaginationMutation() {
  const { setDisbursements } = useDisbursementStore()

  return useCustomMutation<
    ReturnPayload<Disbursement>,
    GetPayload<Disbursement>
  >({
    initialData,
    mutationKey: ['disbursements', 'get-pagination'],
    onSuccess: setDisbursements,
    onError: () => setDisbursements(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Disbursement[]>(
        getQueryString(API_PATH_GET_DISBURSEMENT_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
