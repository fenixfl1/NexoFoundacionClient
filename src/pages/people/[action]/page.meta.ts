import { LoaderFunction } from 'react-router-dom'
import { API_PATH_GET_ONE_PERSON, PATH_PERSON_FORM } from 'src/constants/routes'
import { activityParameterLoader } from 'src/pages/loader'
import { getRequest } from 'src/services/api'
import { Person } from 'src/services/people/people.types'
import { useGeneralStore } from 'src/store/general.store'
import { usePeopleStore } from 'src/store/people.store'
import { PageMetadata } from 'src/types/general'

const loader: LoaderFunction = async (args) => {
  const parameters = await activityParameterLoader(args)

  const { action, personId } = args.params
  if (action === 'create') {
    return {}
  }

  const {
    data: { data: person },
  } = await getRequest<Person>(API_PATH_GET_ONE_PERSON, personId)

  usePeopleStore.setState({ person })
  useGeneralStore.setState({
    title: `Formulario de edición · ${person.NAME} ${person.LAST_NAME}`,
  })

  return { person, parameters }
}

const metadata: PageMetadata = {
  path: PATH_PERSON_FORM,
  loader,
  title: ({ params }) => {
    const titles = {
      edit: `Editar persona`,
      create: `Crear nueva persona`,
    }

    return titles[params.action]
  },
}

export default metadata
