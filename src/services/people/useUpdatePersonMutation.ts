import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { putRequest } from '../api'
import { API_PATH_CREATE_UPDATE_PERSON } from 'src/constants/routes'
import { PersonPayload, Person } from './people.types'
import { usePeopleStore } from 'src/store/people.store'

export function useUpdatePersonMutation() {
  const { setPerson } = usePeopleStore()

  return useCustomMutation<{ data: Person; message?: string }, PersonPayload>({
    initialData: { data: <Person>{} },
    mutationKey: ['people', 'update-person'],
    onSuccess: (resp) => setPerson(resp.data),
    mutationFn: async (payload) => {
      const { data } = await putRequest<Person>(
        API_PATH_CREATE_UPDATE_PERSON,
        payload
      )

      return data
    },
  })
}
