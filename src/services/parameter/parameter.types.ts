export interface Parameter {
  PARAMETER_ID: number
  PARAMETER: string
  DESCRIPTION: string
  VALUE: string
  MENU_OPTION_ID: string
  STATE: string
}

export interface ActivityParameter {
  [key: string]: string
}
