import { LoaderFunction } from 'react-router-dom'
import { API_PATH_GET_ACTIVITY_PARAMETER } from 'src/constants/routes'
import { isLoggedIn } from 'src/lib/session'
import { getRequest } from 'src/services/api'
import { ActivityParameter } from 'src/services/parameter/parameter.types'
import { useParameterStore } from 'src/store/parameter.store'

export const activityParameterLoader: LoaderFunction = async ({ params }) => {
  const { activityId } = params

  if (!activityId || !isLoggedIn()) {
    return {}
  }

  const {
    data: { data = {} },
  } = await getRequest<ActivityParameter>(
    API_PATH_GET_ACTIVITY_PARAMETER,
    activityId
  )

  useParameterStore.setState({ activityParameter: data })

  return { data }
}
