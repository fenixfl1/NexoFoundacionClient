import React, { useEffect, useState } from 'react'
import 'dayjs/locale/es'
import 'moment/dist/locale/es'
import ConditionalComponent from 'src/components/ConditionalComponent'
import Fallback from 'src/components/Fallback'
import Spanish from 'antd/lib/locale/es_ES'
import dayjs from 'dayjs'
import moment from 'moment'
import queryClient from 'src/lib/query-client'
import router from 'src/routes'
import { App as AntAppContext, ConfigProvider, theme, ThemeConfig } from 'antd'
import { NotificationProvider } from 'src/context/NotificationContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { ThemeProvider } from 'styled-components'
import { defaultTheme } from 'src/config/theme'
import { useAppContext } from 'src/context/AppContext'
import { useLoadTheme } from 'src/hooks/use-load-theme'

moment.locale('es')
dayjs.locale('es')

const { defaultAlgorithm, darkAlgorithm, compactAlgorithm, defaultConfig } =
  theme

const algorithm = {
  light: [defaultAlgorithm, compactAlgorithm],
  dark: [darkAlgorithm, compactAlgorithm],
}

const App: React.FC<React.PropsWithChildren> = () => {
  const { theme } = useAppContext()
  const [loadTheme] = useLoadTheme()
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>()

  useEffect(() => {
    loadTheme(theme).then((config) => {
      setThemeConfig({
        ...defaultConfig,
        ...config,
        algorithm: algorithm[theme],
      })
    })
  }, [theme])

  return (
    <ConditionalComponent
      condition={!!themeConfig && !!themeConfig?.token}
      fallback={<Fallback />}
    >
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          locale={Spanish}
          componentSize={'middle'}
          theme={{
            ...themeConfig,
            algorithm: algorithm[theme],
          }}
        >
          <ThemeProvider
            theme={{
              ...defaultTheme,
              ...themeConfig?.token,
              boxShadow: themeConfig?.token.boxShadow,
              isDark: theme === 'dark',
            }}
          >
            <NotificationProvider>
              <AntAppContext>
                <RouterProvider router={router()} />
              </AntAppContext>
            </NotificationProvider>
          </ThemeProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </ConditionalComponent>
  )
}

export default App
