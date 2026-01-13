export interface Parameter {
  PARAMETER_ID: number
  PARAMETER: string
  DESCRIPTION: string
  VALUE: string
  MENU_OPTION_ID: string
  MENU_OPTION_NAME?: string
  STATE: string
}

export interface ActivityParameter {
  [key: string]: string
}

export interface ParameterPayload {
  MENU_OPTION_ID: string
  PARAMETER: string
  DESCRIPTION?: string
  VALUE?: string
  STATE?: string
}

export interface UpdateParameterPayload extends ParameterPayload {
  PARAMETER_ID: number
}
