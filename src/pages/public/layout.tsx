import React from 'react'

export const layoutMeta = { titleTemplate: 'Nexo Foundation · %s' }

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{children}</>
}

export default RootLayout
