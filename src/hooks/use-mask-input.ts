/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect } from 'react'
import IMask from 'imask'

interface IMaskInputProps {
  id: string
  args: any
}

/**
 * This hook is used to apply a mask to any input element just by passing the id of the element and the mask to be applied
 * @param {string} id ID of the input element
 * @param {IMask.AnyMaskedOptions | string} args Mask to be applied
 */
function useMaskInput({ id, args }: IMaskInputProps): void {
  const maskArgs = typeof args === 'string' ? { mask: args, lazy: true } : args

  const handleMask = useCallback(() => {
    const element = document.getElementById(id)

    if (element !== undefined && element !== null) {
      const mask = IMask(element, maskArgs)

      return mask
    }
  }, [id, maskArgs])

  useEffect(() => {
    const mask = handleMask()

    return () => {
      mask?.destroy()
    }
  }, [handleMask])
}

export default useMaskInput
