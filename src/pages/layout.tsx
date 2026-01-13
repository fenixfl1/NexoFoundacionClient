import React from 'react'
import { getSessionInfo } from 'src/lib/session'
import { AppError } from 'src/utils/app-error'

export const layoutMeta = { titleTemplate: 'Nexo Foundation · %s' }

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { roleId } = getSessionInfo()

  if (isNaN(Number(roleId))) {
    throw new AppError('No tienes permisos para acceder a esta vista.', {
      code: '403',
    })
  }

  return <>{children}</>
}

export default RootLayout
