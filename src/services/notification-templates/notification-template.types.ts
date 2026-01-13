export type NotificationChannel =
  | 'email'
  | 'sms'
  | 'in_app'
  | 'push'
  | 'whatsapp'

export interface NotificationTemplate {
  TEMPLATE_ID: number
  TEMPLATE_KEY: string
  NAME: string
  DESCRIPTION?: string | null
  CHANNEL: NotificationChannel
  SUBJECT?: string | null
  BODY: string
  PARAMETERS?: Record<string, unknown> | null
  DEFAULTS?: Record<string, unknown> | null
  MENU_OPTION_ID?: string | null
  MENU_OPTION_NAME?: string | null
  STATE: string
  CREATED_AT?: string
  UPDATED_AT?: string
}

export type NotificationTemplatePayload = Omit<
  NotificationTemplate,
  | 'TEMPLATE_ID'
  | 'MENU_OPTION_NAME'
  | 'CREATED_AT'
  | 'UPDATED_AT'
  | 'STATE'
> & {
  STATE?: string
}
