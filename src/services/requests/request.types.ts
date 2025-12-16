export type RequestStatus =
  | 'new'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'scheduled'

export interface RequestItem {
  REQUEST_ID: number
  STUDENT_NAME: string
  STUDENT_LAST_NAME: string
  IDENTITY_DOCUMENT: string
  UNIVERSITY: string
  CAREER: string
  REQUEST_TYPE: string
  STATUS: RequestStatus
  CREATED_AT: string
  UPDATED_AT?: string
  COHORT?: string
  ASSIGNED_COORDINATOR?: string
  CONTACT_EMAIL?: string
  CONTACT_PHONE?: string
  NEXT_APPOINTMENT?: string
  NOTES?: string
}
