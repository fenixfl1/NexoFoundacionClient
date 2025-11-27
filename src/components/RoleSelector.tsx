import React, { useCallback, useEffect } from 'react'
import CustomSelect, { CustomSelectProps } from './custom/CustomSelect'
import { useGetRolePaginationMutation } from 'src/services/roles/useGetRolePaginationMutation'

interface RoleSelectorProps extends CustomSelectProps {
  multiple?: boolean
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  multiple = false,
  ...props
}) => {
  const {
    mutate: getRoles,
    data: { data = [] },
  } = useGetRolePaginationMutation()

  const handleSearch = useCallback(() => {
    getRoles({
      page: 1,
      size: 15,
      condition: [
        {
          value: 'A',
          field: 'STATE',
          operator: '=',
        },
      ],
    })
  }, [])

  useEffect(handleSearch, [handleSearch])

  return (
    <CustomSelect
      mode={multiple ? 'multiple' : undefined}
      options={data.map((rol) => ({ label: rol.NAME, value: rol.ROLE_ID }))}
      placeholder={'Seleccionar rol'}
      {...props}
    />
  )
}

export default RoleSelector
