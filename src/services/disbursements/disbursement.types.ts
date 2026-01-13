export interface Disbursement {
  DISBURSEMENT_ID: number
  SCHOLARSHIP_ID: number
  COST_ID?: number | null
  AMOUNT: number
  DISBURSEMENT_DATE: string
  METHOD?: string | null
  REFERENCE?: string | null
  STATUS: string
  NOTES?: string | null
  STATE?: string
  CREATED_AT?: string
  SCHOLARSHIP_NAME?: string
  STUDENT_ID?: number
  STUDENT_NAME?: string
  STUDENT_LAST_NAME?: string
  IDENTITY_DOCUMENT?: string
}

export type DisbursementPayload = Omit<
  Disbursement,
  | 'DISBURSEMENT_ID'
  | 'SCHOLARSHIP_NAME'
  | 'STUDENT_ID'
  | 'STUDENT_NAME'
  | 'STUDENT_LAST_NAME'
  | 'IDENTITY_DOCUMENT'
  | 'CREATED_AT'
>
