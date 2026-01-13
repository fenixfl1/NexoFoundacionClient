import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { NotificationTemplate } from './notification-template.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_NOTIFICATION_TEMPLATE_PAGINATION } from 'src/constants/routes'
import { useNotificationTemplateStore } from 'src/store/notification-template.store'

const initialData: ReturnPayload<NotificationTemplate> = {
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
  },
}

export function useGetNotificationTemplatePaginationMutation() {
  const { setTemplates } = useNotificationTemplateStore()

  return useCustomMutation<
    ReturnPayload<NotificationTemplate>,
    GetPayload<NotificationTemplate>
  >({
    initialData,
    mutationKey: ['notification-templates', 'get-pagination'],
    onSuccess: setTemplates,
    onError: () => setTemplates(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<NotificationTemplate[]>(
        getQueryString(API_PATH_GET_NOTIFICATION_TEMPLATE_PAGINATION, {
          page,
          size,
        }),
        condition
      )

      return data || initialData
    },
  })
}
