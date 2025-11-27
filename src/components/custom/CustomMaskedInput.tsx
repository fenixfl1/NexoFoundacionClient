import React, { useMemo } from 'react'
import Input, { Mask, MaskedInputProps } from 'react-text-mask'
import CustomInput, { CustomInputProps } from './CustomInput'
import { MaskType } from 'src/types/general'
import { maskedInput } from 'src/constants/general'

export type CustomProps = CustomInputProps &
  Omit<MaskedInputProps, 'mask'> &
  Omit<Readonly<MaskedInputProps>, 'mask'> & {
    prefix?: string & React.ReactNode
    props?: never
    type: keyof MaskType
  }

const CustomMaskedInput: React.FC<CustomProps> = ({
  guide = true,
  autoComplete = 'off',
  keepCharPositions = true,
  width,
  type,
  value,
  prefix,
  suffix,
  style,
  placeholder,
  ...props
}) => {
  const mask = useMemo(() => {
    switch (type) {
      case 'cedula_rnc':
        return (value: string = '') => {
          const numericValue = value?.replace(/\D/g, '')
          return numericValue.length <= 9
            ? maskedInput['rnc']
            : maskedInput['cedula']
        }

      case 'phone':
        return (value: string = '') => {
          return value.length < (maskedInput['phone'] as unknown[]).length + 1
            ? maskedInput['phone']
            : maskedInput['phone_format']
        }

      default:
        return maskedInput[type] as Mask
    }
  }, [type])

  return (
    <Input
      value={value}
      autoComplete={autoComplete}
      guide={guide}
      keepCharPositions={keepCharPositions}
      mask={mask}
      render={(ref, props) => (
        <CustomInput
          placeholder={placeholder}
          prefix={prefix}
          ref={(input) => ref?.(input?.nativeElement) as never}
          style={style}
          suffix={suffix}
          value={value}
          width={width}
          {...props}
        />
      )}
      {...props}
    />
  )
}

export default CustomMaskedInput
