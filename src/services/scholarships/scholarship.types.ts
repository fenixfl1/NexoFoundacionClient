export interface Scholarship {
  SCHOLARSHIP_ID: number
  STUDENT_ID: number
  REQUEST_ID?: number | null
  NAME: string
  DESCRIPTION?: string | null
  AMOUNT: number
  START_DATE: string
  END_DATE?: string | null
  PERIOD_TYPE?: string
  STATUS: string
  STATE?: string
  CREATED_AT?: string
  STUDENT_NAME?: string
  STUDENT_LAST_NAME?: string
  IDENTITY_DOCUMENT?: string
  UNIVERSITY?: string
  CAREER?: string
  REQUEST_TYPE?: string | null
}

export type ScholarshipPayload = Omit<
  Scholarship,
  | 'SCHOLARSHIP_ID'
  | 'STUDENT_NAME'
  | 'STUDENT_LAST_NAME'
  | 'IDENTITY_DOCUMENT'
  | 'UNIVERSITY'
  | 'CAREER'
  | 'REQUEST_TYPE'
  | 'CREATED_AT'
>
