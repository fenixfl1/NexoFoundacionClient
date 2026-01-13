import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { NotificationTemplate } from './notification-template.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_NOTIFICATION_TEMPLATE } from 'src/constants/routes'

export function useUpdateNotificationTemplateMutation() {
  return useCustomMutation<NotificationTemplate, NotificationTemplate>({
    initialData: <NotificationTemplate>{},
    mutationKey: ['notification-templates', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<NotificationTemplate>(
        API_PATH_CREATE_UPDATE_NOTIFICATION_TEMPLATE,
        payload
      )

      return data
    },
  })
}
