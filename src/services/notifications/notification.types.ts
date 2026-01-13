import { NotificationChannel } from '../notification-templates/notification-template.types'

export type NotificationStatus = 'P' | 'C' | 'S' | 'F'

export interface NotificationItem {
  NOTIFICATION_ID: number
  TEMPLATE_ID?: number | null
  TEMPLATE_KEY?: string
  TEMPLATE_NAME?: string
  CHANNEL: NotificationChannel
  RECIPIENT: string
  SUBJECT?: string | null
  BODY: string
  PAYLOAD?: Record<string, unknown> | null
  STATUS: NotificationStatus
  RELATED_ENTITY?: string | null
  RELATED_ID?: string | null
  SCHEDULED_AT?: string | null
  SENT_AT?: string | null
  SENT_BY?: number | null
  ERROR_MESSAGE?: string | null
  STATE?: string
  CREATED_AT?: string
  UPDATED_AT?: string
}

export type NotificationPayload = Omit<
  NotificationItem,
  | 'NOTIFICATION_ID'
  | 'STATE'
  | 'CREATED_AT'
  | 'UPDATED_AT'
  | 'TEMPLATE_NAME'
  | 'TEMPLATE_KEY'
> & {
  STATE?: string
}
