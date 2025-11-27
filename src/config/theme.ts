import { ThemeConfig } from 'antd/es/config-provider/context'
import { theme } from 'antd'
import { DefaultTheme } from 'styled-components'
import * as Colors from '@ant-design/colors'
import { colors } from 'src/constants/colors'
import { AliasToken } from 'antd/lib/theme/interface'

type Colors = typeof Colors

type BreakpointConfig = {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Partial<AliasToken> {
    backgroundColor: string
    baseBgColor: string
    bgDark: string
    borderColor: string
    breakpoints: BreakpointConfig
    colorBgContainer: string
    colorPrimaryHover: string
    colorPrimaryText: string
    colors: Colors
    dangerColor: string
    h1FontSize: string
    paragraphFontSize: string
    primaryColor: string
    secondaryColor: string
    secondaryColorHover: string
    textColor: string
    whiteBackground: string
    isDark?: boolean
  }
}

export const defaultTheme: DefaultTheme = {
  primaryColor: colors.primary,
  secondaryColor: colors.secondary,
  baseBgColor: colors.baseBackground,
  backgroundColor: colors.baseBackground,
  textColor: colors.secondaryBgColor,
  borderColor: colors.border,
  colorPrimaryHover: '#f9f0ff',
  colorPrimaryText: '#9254de',
  colorBgContainer: '#ffffff',
  colors: Colors,
  bgDark: '#141414',
  whiteBackground: '#fff',
  secondaryColorHover: colors.secondaryHover,
  paragraphFontSize: '16px',
  h1FontSize: '32px',
  dangerColor: colors.danger,
  breakpoints: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },
}

export const panelStyle: React.CSSProperties = {
  marginBottom: 24,
  background: colors.secondaryBgColor,
  borderRadius: defaultTheme.borderRadius,
  border: 'none',
}

const { defaultConfig } = theme

export const antTheme: ThemeConfig = {
  ...defaultConfig,
}
