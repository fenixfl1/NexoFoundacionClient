/* eslint-disable @typescript-eslint/no-explicit-any */
export const normalizeNumbers = (event: any) => {
  const value = event.target.value

  if (value) {
    return value?.replace(/\D/g, '').trim()
  }

  return ''
}

export const normalizeEditorValue = (value: string) => {
  return value?.trim()
}

export const normalizeFile = (e: any) => {
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}
