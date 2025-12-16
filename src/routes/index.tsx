import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router'
import { publicRoutes, privateRoutes } from './auto-routes'
import { PATH_HOME, PATH_INDEX } from 'src/constants/routes'
import AuthGuard from './AuthGuard'
import GuestGuard from './GuestGuard'
import ErrorElement from 'src/pages/error'
import { activityParameterLoader } from 'src/pages/loader'

const router = () =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<ErrorElement />}>
        <Route element={<GuestGuard />}>
          {publicRoutes.map(({ path, loader, element }, key) => (
            <Route element={element} key={key} loader={loader} path={path} />
          ))}
        </Route>

        <Route element={<AuthGuard />}>
          <Route path={PATH_HOME} element={<Navigate to={PATH_INDEX} />} />
          <Route path={'/:activityId'}>
            {privateRoutes.map(
              ({ path, loader = activityParameterLoader, element }, key) => (
                <Route
                  element={element}
                  key={key}
                  loader={loader}
                  path={path}
                />
              )
            )}
          </Route>
        </Route>
      </Route>
    )
  )

export default router
