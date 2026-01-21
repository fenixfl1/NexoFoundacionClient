import { useQuery } from '@tanstack/react-query'
import { getRequest } from '../api'
import { API_PATH_GET_DASHBOARD_ACTIVITY } from 'src/constants/routes'
import { DashboardActivityItem } from './dashboard.types'

export function useGetDashboardActivityQuery() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<DashboardActivityItem[]>(
        API_PATH_GET_DASHBOARD_ACTIVITY
      )

      return data || []
    },
  })
}
