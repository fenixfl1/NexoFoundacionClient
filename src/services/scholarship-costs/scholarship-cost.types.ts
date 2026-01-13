export interface ScholarshipCost {
  COST_ID: number
  SCHOLARSHIP_ID: number
  PERIOD_TYPE: string
  PERIOD_LABEL: string
  PERIOD_START: string
  PERIOD_END: string
  AMOUNT: number
  STATUS: string
  NOTES?: string | null
  STATE?: string
  CREATED_AT?: string
  SCHOLARSHIP_NAME?: string
  STUDENT_NAME?: string
  STUDENT_LAST_NAME?: string
  IDENTITY_DOCUMENT?: string
}

export type ScholarshipCostPayload = Omit<
  ScholarshipCost,
  | 'COST_ID'
  | 'SCHOLARSHIP_NAME'
  | 'STUDENT_NAME'
  | 'STUDENT_LAST_NAME'
  | 'IDENTITY_DOCUMENT'
  | 'CREATED_AT'
>
