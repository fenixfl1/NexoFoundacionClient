import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { NotificationItem } from './notification.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_NOTIFICATION } from 'src/constants/routes'

export function useCreateNotificationMutation() {
  return useCustomMutation<NotificationItem, Partial<NotificationItem>>({
    initialData: <NotificationItem>{},
    mutationKey: ['notifications', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<NotificationItem>(
        API_PATH_CREATE_UPDATE_NOTIFICATION,
        payload
      )

      return data
    },
  })
}
