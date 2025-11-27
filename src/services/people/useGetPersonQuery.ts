import { Person } from './people.types'
import { getRequest } from '../api'
import { API_PATH_CREATE_UPDATE_PERSON } from 'src/constants/routes'
import { usePeopleStore } from 'src/store/people.store'
import { useQuery } from '@tanstack/react-query'

export function useGetPersonQuery(username: string) {
  const { setPerson } = usePeopleStore()

  return useQuery<Person>({
    initialData: <Person>{},
    enabled: !!username,
    queryKey: ['people', 'get-person'],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<Person>(
        `${API_PATH_CREATE_UPDATE_PERSON}/${username}`
      )

      setPerson(data)

      return data
    },
  })
}
