import { create } from 'zustand'
import { Metadata, ReturnPayload } from 'src/types/general'
import { NotificationItem } from 'src/services/notifications/notification.types'

const defaultMetadata: Metadata = {
  currentPage: 1,
  totalPages: 0,
  totalRows: 0,
  count: 0,
  pageSize: 10,
  links: undefined,
}

interface UseNotificationStore {
  notifications: NotificationItem[]
  metadata: Metadata
  summary: Record<string, string | number>
  setNotifications: (payload: ReturnPayload<NotificationItem>) => void
}

export const useNotificationStore = create<UseNotificationStore>((set) => ({
  notifications: [],
  metadata: defaultMetadata,
  summary: {},
  setNotifications: ({ data, metadata }) =>
    set({
      notifications: data,
      metadata: metadata?.pagination ?? defaultMetadata,
      summary: metadata?.summary ?? {},
    }),
}))
