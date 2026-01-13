import { getSessionInfo } from 'src/lib/session'
import { PATH_ROLE_ADMIN, PATH_ROLE_STUDENT } from 'src/constants/routes'

export const ROLE_ADMIN_ID = '1'
export const ROLE_STUDENT_ID = '3'

export const getRoleBasePath = (roleId?: string) => {
  if (roleId === ROLE_STUDENT_ID) {
    return `/${PATH_ROLE_STUDENT}`
  }

  return `/${PATH_ROLE_ADMIN}`
}

export const getCurrentRoleBasePath = () => {
  const { roleId } = getSessionInfo()
  return getRoleBasePath(String(roleId))
}
