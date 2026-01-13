import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { NotificationItem } from './notification.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_NOTIFICATION_PAGINATION } from 'src/constants/routes'
import { useNotificationStore } from 'src/store/notification.store'

const initialData: ReturnPayload<NotificationItem> = {
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

export function useGetNotificationPaginationMutation() {
  const { setNotifications } = useNotificationStore()

  return useCustomMutation<
    ReturnPayload<NotificationItem>,
    GetPayload<NotificationItem>
  >({
    initialData,
    mutationKey: ['notifications', 'get-pagination'],
    onSuccess: setNotifications,
    onError: () => setNotifications(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<NotificationItem[]>(
        getQueryString(API_PATH_GET_NOTIFICATION_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
