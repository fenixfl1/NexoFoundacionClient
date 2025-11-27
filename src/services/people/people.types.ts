import { Contact } from '../contact/contact.types'

export interface Person {
  PERSON_ID: number
  NAME: string
  LAST_NAME: string
  GENDER: string
  BIRTH_DATE: string
  IDENTITY_DOCUMENT: string
  STATE: string
  CREATED_AT: string
  CREATED_BY: number
  PHONE?: string
  EMAIL?: string
  ROLE_NAME?: string
  USERNAME: string
  ADDRESS: string
  AVATAR: string
  CONTACTS: Contact[]
  REFERENCES: Reference[]
  USER_ID: number
}

export interface Reference {
  RELATIONSHIP: string
  PHONE: string
  EMAIL: string
  ADDRESS: string
  NOTES: string
  FULL_NAME: string
  STATE: string
  CREATED_AT: string
  CREATED_BY: number
}

export interface PersonPayload {
  PASSWORD: string
  USERNAME: string
  NAME: string
  LAST_NAME: string
  GENDER: string
  BIRTH_DATE: string
  IDENTITY_DOCUMENT: string
  ROLE_ID: number
  CONTACTS: Contact[]
  REFERENCES: Reference[]
}
