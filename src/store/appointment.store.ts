import { Appointment } from 'src/services/appointments/appointment.types'
import { Metadata, ReturnPayload } from 'src/types/general'
import { create } from 'zustand'

const defaultMetadata: Metadata = {
  currentPage: 1,
  totalPages: 0,
  totalRows: 0,
  count: 0,
  pageSize: 10,
  links: undefined,
}

interface UseAppointmentStore {
  appointments: Appointment[]
  metadata: Metadata
  setAppointments: (payload: ReturnPayload<Appointment>) => void
}

export const useAppointmentStore = create<UseAppointmentStore>((set) => ({
  appointments: [],
  metadata: defaultMetadata,
  setAppointments: ({ data, metadata }) =>
    set({
      appointments: data,
      metadata: metadata?.pagination ?? defaultMetadata,
    }),
}))
