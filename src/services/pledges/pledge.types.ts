export interface Pledge {
  PLEDGE_ID: number
  SPONSOR_ID: number
  NAME: string
  DESCRIPTION?: string | null
  AMOUNT: number
  START_DATE: string
  END_DATE?: string | null
  FREQUENCY?: string | null
  STATUS: string
  NOTES?: string | null
  STATE?: string
  CREATED_AT?: string
  SPONSOR_NAME?: string
  SPONSOR_TYPE?: string | null
}

export type PledgePayload = Omit<
  Pledge,
  'PLEDGE_ID' | 'SPONSOR_NAME' | 'SPONSOR_TYPE' | 'CREATED_AT'
>
