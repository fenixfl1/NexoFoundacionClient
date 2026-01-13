// export type ScholarshipStatus =
//   | 'pending'
//   | 'active'
//   | 'suspended'
//   | 'completed'
//   | 'graduated'

export enum ScholarshipStatus {
  PENDING = 'P',
  ACTIVE = 'A',
  SUSPENDED = 'S',
  COMPLETED = 'C',
  GRADUATED = 'G',
}

export type StudentPayload = Partial<Student>

export interface Student {
  STUDENT_ID: number
  PERSON_ID: number
  NAME: string
  LAST_NAME: string
  IDENTITY_DOCUMENT: string
  UNIVERSITY: string
  CAREER: string
  SCHOLARSHIP_STATUS: ScholarshipStatus
  ACADEMIC_AVERAGE: number
  HOURS_REQUIRED: number
  HOURS_COMPLETED: number
  LAST_FOLLOW_UP: string
  NEXT_APPOINTMENT?: string
  CONTACT_EMAIL: string
  CONTACT_PHONE: string
  COHORT: string
  CAMPUS?: string
  SCORE?: number
  STATE?: string
  FILTER?: string
}
