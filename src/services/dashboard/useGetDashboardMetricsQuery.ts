import { useQuery } from '@tanstack/react-query'
import { getRequest } from '../api'
import { API_PATH_GET_DASHBOARD_METRICS } from 'src/constants/routes'
import { DashboardMetrics } from './dashboard.types'

export function useGetDashboardMetricsQuery() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<DashboardMetrics>(API_PATH_GET_DASHBOARD_METRICS)

      return data
    },
  })
}
