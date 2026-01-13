import { Dayjs } from 'dayjs'

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Appointment {
  APPOINTMENT_ID: number
  PERSON_ID: number
  REQUEST_ID?: number | null
  STUDENT_ID?: number | null
  TITLE: string
  DESCRIPTION?: string | null
  START_AT: string | Dayjs
  END_AT?: string | null | Dayjs
  LOCATION?: string | null
  STATUS: AppointmentStatus
  NOTES?: string | null
  NAME?: string
  LAST_NAME?: string
  IDENTITY_DOCUMENT?: string
  REQUEST_TYPE?: string
  UNIVERSITY?: string
  STATE?: string
}

export type AppointmentPayload = Omit<
  Appointment,
  | 'APPOINTMENT_ID'
  | 'NAME'
  | 'LAST_NAME'
  | 'IDENTITY_DOCUMENT'
  | 'REQUEST_TYPE'
  | 'UNIVERSITY'
>
