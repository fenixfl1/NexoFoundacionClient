export interface StudentRequirement {
  STUDENT_REQUIREMENT_ID: number
  STUDENT_ID: number
  REQUIREMENT_ID: number
  STATUS: string
  OBSERVATION?: string | null
  VALIDATED_BY?: number | null
  VALIDATED_AT?: string | null
  STATE?: string
  CREATED_AT?: string
  REQUIREMENT_KEY?: string
  REQUIREMENT_NAME?: string
  REQUIREMENT_DESCRIPTION?: string | null
  IS_REQUIRED?: boolean
  PERSON_ID?: number
  NAME?: string
  LAST_NAME?: string
  IDENTITY_DOCUMENT?: string
  UNIVERSITY?: string
  CAREER?: string
}

export type StudentRequirementPayload = Omit<
  StudentRequirement,
  | 'STUDENT_REQUIREMENT_ID'
  | 'REQUIREMENT_KEY'
  | 'REQUIREMENT_NAME'
  | 'REQUIREMENT_DESCRIPTION'
  | 'IS_REQUIRED'
  | 'PERSON_ID'
  | 'NAME'
  | 'LAST_NAME'
  | 'IDENTITY_DOCUMENT'
  | 'UNIVERSITY'
  | 'CAREER'
  | 'CREATED_AT'
>
