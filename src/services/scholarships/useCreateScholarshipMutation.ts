import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Scholarship, ScholarshipPayload } from './scholarship.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_SCHOLARSHIP } from 'src/constants/routes'

export function useCreateScholarshipMutation() {
  return useCustomMutation<Scholarship, ScholarshipPayload>({
    initialData: <Scholarship>{},
    mutationKey: ['scholarships', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Scholarship>(
        API_PATH_CREATE_UPDATE_SCHOLARSHIP,
        payload
      )

      return data
    },
  })
}
