import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { Appointment } from './appointment.types'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_APPOINTMENT } from 'src/constants/routes'

export function useUpdateAppointmentMutation() {
  return useCustomMutation<Appointment, Appointment>({
    initialData: <Appointment>{},
    mutationKey: ['appointments', 'update'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<Appointment>(
        API_PATH_CREATE_UPDATE_APPOINTMENT,
        payload
      )

      return data
    },
  })
}
