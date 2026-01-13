import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { GetPayload, ReturnPayload } from 'src/types/general'
import { StudentRequirement } from './student-requirement.types'
import { getQueryString, postRequest } from '../api'
import { API_PATH_GET_STUDENT_REQUIREMENT_PAGINATION } from 'src/constants/routes'
import { useStudentRequirementStore } from 'src/store/student-requirement.store'

const initialData: ReturnPayload<StudentRequirement> = {
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
    summary: {},
  },
}

export function useGetStudentRequirementPaginationMutation() {
  const { setStudentRequirements } = useStudentRequirementStore()

  return useCustomMutation<
    ReturnPayload<StudentRequirement>,
    GetPayload<StudentRequirement>
  >({
    initialData,
    mutationKey: ['student-requirements', 'get-pagination'],
    onSuccess: setStudentRequirements,
    onError: () => setStudentRequirements(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<StudentRequirement[]>(
        getQueryString(API_PATH_GET_STUDENT_REQUIREMENT_PAGINATION, {
          page,
          size,
        }),
        condition
      )

      return data || initialData
    },
  })
}
