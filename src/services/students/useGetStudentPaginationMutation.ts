import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { Student } from './student.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_STUDENT_PAGINATION } from 'src/constants/routes'
import { useStudentStore } from 'src/store/students.store'

const initialData: ReturnPayload<Student> = {
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

export function useGetStudentPaginationMutation() {
  const { setStudents } = useStudentStore()

  return useCustomMutation<ReturnPayload<Student>, GetPayload<Student>>({
    initialData,
    mutationKey: ['students', 'get-pagination'],
    onSuccess: setStudents,
    onError: () => setStudents(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Student[]>(
        getQueryString(API_PATH_GET_STUDENT_PAGINATION, { page, size }),
        condition
      )

      return data || initialData
    },
  })
}
