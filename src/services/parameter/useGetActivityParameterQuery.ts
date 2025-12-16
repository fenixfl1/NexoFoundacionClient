import { useQuery } from '@tanstack/react-query'
import { getRequest } from '../api'
import { ActivityParameter } from './parameter.types'
import { API_PATH_GET_ACTIVITY_PARAMETER } from 'src/constants/routes'
import { useParameterStore } from 'src/store/parameter.store'

export function useGetActivityParameterQuery(activityId: string) {
  const { setActivityParameter } = useParameterStore()

  return useQuery({
    queryKey: ['parameter', 'get-activity-parameters', activityId],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<ActivityParameter>(
        API_PATH_GET_ACTIVITY_PARAMETER,
        activityId
      )

      setActivityParameter(data ?? {})

      return data
    },
  })
}
