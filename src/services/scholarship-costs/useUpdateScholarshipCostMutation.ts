import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { ScholarshipCost } from './scholarship-cost.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_SCHOLARSHIP_COST } from 'src/constants/routes'

export function useUpdateScholarshipCostMutation() {
  return useCustomMutation<ScholarshipCost, ScholarshipCost>({
    initialData: <ScholarshipCost>{},
    mutationKey: ['scholarship-costs', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<ScholarshipCost>(
        API_PATH_CREATE_UPDATE_SCHOLARSHIP_COST,
        payload
      )

      return data
    },
  })
}
