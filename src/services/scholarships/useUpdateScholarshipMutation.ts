import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Scholarship } from './scholarship.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_SCHOLARSHIP } from 'src/constants/routes'

export function useUpdateScholarshipMutation() {
  return useCustomMutation<Scholarship, Scholarship>({
    initialData: <Scholarship>{},
    mutationKey: ['scholarships', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<Scholarship>(
        API_PATH_CREATE_UPDATE_SCHOLARSHIP,
        payload
      )

      return data
    },
  })
}
