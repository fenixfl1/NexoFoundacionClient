/* eslint-disable @typescript-eslint/no-explicit-any */
export const normalizeNumbers = (event: any) => {
  const value = event.target.value

  if (value) {
    return value?.replace(/\D/g, '').trim()
  }

  return ''
}
