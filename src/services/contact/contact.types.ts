export enum ContactType {
  EMAIL = 'email',
  PHONE = 'phone',
  WHATSAPP = 'whatsapp',
  OTHER = 'other',
}

export enum ContactUsage {
  PERSONAL = 'personal',
  INSTITUTIONAL = 'institutional',
  EMERGENCY = 'emergency',
}

export interface Contact {
  CONTACT_ID: number
  PERSON_ID: number
  TYPE: ContactType
  USAGE: ContactUsage
  VALUE: string
  IS_PRIMARY: boolean
  STATE: string
  CREATED_AT: string
  CREATED_BY: number
}
