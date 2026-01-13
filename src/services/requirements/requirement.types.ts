export interface Requirement {
  REQUIREMENT_ID: number
  REQUIREMENT_KEY: string
  NAME: string
  DESCRIPTION?: string | null
  IS_REQUIRED: boolean
  STATE?: string
  CREATED_AT?: string
}

export type RequirementPayload = Omit<
  Requirement,
  'REQUIREMENT_ID' | 'CREATED_AT'
>
