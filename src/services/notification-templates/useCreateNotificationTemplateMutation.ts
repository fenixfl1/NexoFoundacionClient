import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { NotificationTemplate } from './notification-template.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_NOTIFICATION_TEMPLATE } from 'src/constants/routes'

export function useCreateNotificationTemplateMutation() {
  return useCustomMutation<NotificationTemplate, Partial<NotificationTemplate>>({
    initialData: <NotificationTemplate>{},
    mutationKey: ['notification-templates', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<NotificationTemplate>(
        API_PATH_CREATE_UPDATE_NOTIFICATION_TEMPLATE,
        payload
      )

      return data
    },
  })
}
