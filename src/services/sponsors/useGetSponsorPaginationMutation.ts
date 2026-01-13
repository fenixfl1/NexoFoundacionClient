import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { Sponsor } from './sponsor.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_SPONSOR_PAGINATION } from 'src/constants/routes'
import { useSponsorStore } from 'src/store/sponsor.store'

const initialData: ReturnPayload<Sponsor> = {
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

export function useGetSponsorPaginationMutation() {
  const { setSponsors } = useSponsorStore()

  return useCustomMutation<ReturnPayload<Sponsor>, GetPayload<Sponsor>>({
    initialData,
    mutationKey: ['sponsors', 'get-pagination'],
    onSuccess: setSponsors,
    onError: () => setSponsors(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Sponsor[]>(
        getQueryString(API_PATH_GET_SPONSOR_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
