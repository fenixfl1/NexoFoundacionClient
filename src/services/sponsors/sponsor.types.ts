export interface Sponsor {
  SPONSOR_ID: number
  PERSON_ID?: number | null
  NAME: string
  TYPE?: string | null
  TAX_ID?: string | null
  STATE?: string
  CREATED_AT?: string
  PERSON_NAME?: string | null
  PERSON_LAST_NAME?: string | null
  PERSON_IDENTITY_DOCUMENT?: string | null
}

export type SponsorPayload = Omit<
  Sponsor,
  'SPONSOR_ID' | 'CREATED_AT'
>
