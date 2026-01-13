import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import {
  ScholarshipCost,
  ScholarshipCostPayload,
} from './scholarship-cost.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_SCHOLARSHIP_COST } from 'src/constants/routes'

export function useCreateScholarshipCostMutation() {
  return useCustomMutation<ScholarshipCost, ScholarshipCostPayload>({
    initialData: <ScholarshipCost>{},
    mutationKey: ['scholarship-costs', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<ScholarshipCost>(
        API_PATH_CREATE_UPDATE_SCHOLARSHIP_COST,
        payload
      )

      return data
    },
  })
}
