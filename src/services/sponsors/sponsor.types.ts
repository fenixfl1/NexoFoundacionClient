export interface Sponsor {
  SPONSOR_ID: number
  NAME: string
  TYPE?: string | null
  TAX_ID?: string | null
  CONTACT_NAME?: string | null
  CONTACT_EMAIL?: string | null
  CONTACT_PHONE?: string | null
  ADDRESS?: string | null
  NOTES?: string | null
  STATE?: string
  CREATED_AT?: string
}

export type SponsorPayload = Omit<
  Sponsor,
  'SPONSOR_ID' | 'CREATED_AT'
>
