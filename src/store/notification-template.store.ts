import { create } from 'zustand'
import {
  NotificationTemplate,
  NotificationChannel,
} from 'src/services/notification-templates/notification-template.types'
import { Metadata, ReturnPayload } from 'src/types/general'

const defaultMetadata: Metadata = {
  currentPage: 1,
  totalPages: 0,
  totalRows: 0,
  count: 0,
  pageSize: 10,
  links: undefined,
}

interface UseNotificationTemplateStore {
  templates: NotificationTemplate[]
  metadata: Metadata
  setTemplates: (payload: ReturnPayload<NotificationTemplate>) => void
  channels: NotificationChannel[]
}

export const useNotificationTemplateStore =
  create<UseNotificationTemplateStore>((set) => ({
    templates: [],
    metadata: defaultMetadata,
    channels: ['email', 'sms', 'in_app', 'push', 'whatsapp'],
    setTemplates: ({ data, metadata }) =>
      set({
        templates: data,
        metadata: metadata?.pagination ?? defaultMetadata,
      }),
  }))
