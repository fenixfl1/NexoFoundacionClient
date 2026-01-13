export type FollowUpStatus = 'open' | 'completed' | 'cancelled'

export interface FollowUp {
  FOLLOW_UP_ID: number
  STUDENT_ID: number
  APPOINTMENT_ID?: number | null
  FOLLOW_UP_DATE: string
  SUMMARY: string
  NOTES?: string | null
  NEXT_APPOINTMENT?: string | null
  STATUS: FollowUpStatus
  STATE?: string
  PERSON_ID?: number
  NAME?: string
  LAST_NAME?: string
  IDENTITY_DOCUMENT?: string
  UNIVERSITY?: string
  CAREER?: string
}

export type FollowUpPayload = Omit<
  FollowUp,
  | 'FOLLOW_UP_ID'
  | 'PERSON_ID'
  | 'NAME'
  | 'LAST_NAME'
  | 'IDENTITY_DOCUMENT'
  | 'UNIVERSITY'
  | 'CAREER'
>
