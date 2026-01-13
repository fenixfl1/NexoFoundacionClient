import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { Appointment } from './appointment.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_APPOINTMENT_PAGINATION } from 'src/constants/routes'
import { useAppointmentStore } from 'src/store/appointment.store'

const initialData: ReturnPayload<Appointment> = {
  data: [],
  metadata: {
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalRows: 0,
      count: 0,
      pageSize: 10,
      links: undefined,
    },
  },
}

export function useGetAppointmentPaginationMutation() {
  const { setAppointments } = useAppointmentStore()

  return useCustomMutation<
    ReturnPayload<Appointment>,
    GetPayload<Appointment>
  >({
    initialData,
    mutationKey: ['appointments', 'get-pagination'],
    onSuccess: setAppointments,
    onError: () => setAppointments(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Appointment[]>(
        getQueryString(API_PATH_GET_APPOINTMENT_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
