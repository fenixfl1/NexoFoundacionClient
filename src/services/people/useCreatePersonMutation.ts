import { useCustomMutation } from 'src/hooks/use-custom-mutation'
import { postRequest } from '../api'
import { API_PATH_CREATE_UPDATE_PERSON } from 'src/constants/routes'
import { PersonPayload, Person } from './people.types'

export function useCreatePersonMutation() {
  return useCustomMutation<Person, PersonPayload>({
    initialData: <Person>{},
    mutationKey: ['people', 'create-person'],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Person>(API_PATH_CREATE_UPDATE_PERSON, payload)

      return data
    },
  })
}
