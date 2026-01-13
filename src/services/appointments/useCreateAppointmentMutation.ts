import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Appointment, AppointmentPayload } from './appointment.types'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_APPOINTMENT } from 'src/constants/routes'

export function useCreateAppointmentMutation() {
  return useCustomMutation<Appointment, AppointmentPayload>({
    initialData: <Appointment>{},
    mutationKey: ['appointments', 'create'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Appointment>(
        API_PATH_CREATE_UPDATE_APPOINTMENT,
        payload
      )

      return data
    },
  })
}
