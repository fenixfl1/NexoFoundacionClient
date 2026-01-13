import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { NotificationItem } from './notification.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_NOTIFICATION } from 'src/constants/routes'

export function useUpdateNotificationMutation() {
  return useCustomMutation<NotificationItem, NotificationItem>({
    initialData: <NotificationItem>{},
    mutationKey: ['notifications', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<NotificationItem>(
        API_PATH_CREATE_UPDATE_NOTIFICATION,
        payload
      )

      return data
    },
  })
}
