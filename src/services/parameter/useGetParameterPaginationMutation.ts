import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { Parameter } from './parameter.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_PARAMETER_PAGINATION } from 'src/constants/routes'
import { useParameterStore } from 'src/store/parameter.store'

const initialData: ReturnPayload<Parameter> = {
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

export function useGetParameterPaginationMutation() {
  const { setParameters } = useParameterStore()

  return useCustomMutation<ReturnPayload<Parameter>, GetPayload<Parameter>>({
    initialData,
    mutationKey: ['parameters', 'get-pagination'],
    onSuccess: setParameters,
    onError: () => setParameters(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Parameter[]>(
        getQueryString(API_PATH_GET_PARAMETER_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
