import { Form, FormInstance } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ConditionalComponent from 'src/components/ConditionalComponent'
import CustomCol from 'src/components/custom/CustomCol'
import CustomDatePicker from 'src/components/custom/CustomDatePicker'
import CustomFormItem from 'src/components/custom/CustomFormItem'
import CustomInput from 'src/components/custom/CustomInput'
import CustomInputNumber from 'src/components/custom/CustomInputNumber'
import CustomMaskedInput from 'src/components/custom/CustomMaskedInput'
import CustomRadioGroup from 'src/components/custom/CustomRadioGroup'
import CustomRow from 'src/components/custom/CustomRow'
import CustomSelect from 'src/components/custom/CustomSelect'
import { defaultBreakpoints } from 'src/config/breakpoints'
import useDebounce from 'src/hooks/use-debounce'
import { PersonPayload } from 'src/services/people/people.types'
import { useGetRolePaginationMutation } from 'src/services/roles/useGetRolePaginationMutation'
import { useRoleStore } from 'src/store/role.store'
import { normalizeNumbers } from 'src/utils/form-value-normalize'

interface GeneralDataProps {
  form: FormInstance<PersonPayload>
}

const GeneralData: React.FC<GeneralDataProps> = ({ form }) => {
  const roleId = Form.useWatch('ROLE_ID', form)

  const { action } = useParams()

  const [searchKey, setSearchKey] = useState('')
  const debounce = useDebounce(searchKey)

  const { roleList, metadata } = useRoleStore()

  const { mutate: getRoles, isPending: isGetRolesPending } =
    useGetRolePaginationMutation()

  const isEditing = action === 'edit'

  const handleSearchRoles = useCallback(() => {
    getRoles({
      page: metadata.currentPage,
      size: metadata.pageSize,
      condition: [
        {
          value: 'A',
          field: 'STATE',
          operator: '=',
        },
        {
          value: debounce,
          field: 'NAME',
          operator: 'LIKE',
        },
      ],
    })
  }, [debounce])

  useEffect(handleSearchRoles, [handleSearchRoles])

  return (
    <CustomRow justify={'start'}>
      <CustomCol {...defaultBreakpoints}>
        <CustomFormItem
          label={'Cédula'}
          name={'IDENTITY_DOCUMENT'}
          rules={[{ required: true }]}
          getValueFromEvent={normalizeNumbers}
          valuePropName={'value'}
        >
          <CustomMaskedInput
            // readOnly={isEditing}
            placeholder="000-0000000-0"
            type={'document'}
          />
        </CustomFormItem>
      </CustomCol>
      <CustomCol {...defaultBreakpoints}>
        <ConditionalComponent condition={isEditing}>
          <CustomFormItem
            label={'Código'}
            name={'PERSON_ID'}
            rules={[{ required: true }]}
          >
            <CustomInputNumber width={null} readOnly />
          </CustomFormItem>
        </ConditionalComponent>
      </CustomCol>
      <CustomCol {...defaultBreakpoints}>
        <CustomFormItem
          label={'Nombres'}
          name={'NAME'}
          rules={[{ required: true }]}
        >
          <CustomInput placeholder={'Nombres'} />
        </CustomFormItem>
      </CustomCol>
      <CustomCol {...defaultBreakpoints}>
        <CustomFormItem
          label={'Apellidos'}
          name={'LAST_NAME'}
          rules={[{ required: true }]}
        >
          <CustomInput placeholder={'Apellidos'} />
        </CustomFormItem>
      </CustomCol>
      <CustomCol {...defaultBreakpoints}>
        <CustomFormItem
          label={'Fecha Nac.'}
          name={'BIRTH_DATE'}
          rules={[{ required: true }]}
        >
          <CustomDatePicker />
        </CustomFormItem>
      </CustomCol>
      <CustomCol {...defaultBreakpoints}>
        <CustomFormItem
          label={'Sexo.'}
          name={'GENDER'}
          rules={[{ required: true }]}
        >
          <CustomRadioGroup
            options={[
              { label: 'Masculino', value: 'M' },
              { label: 'Femenino', value: 'F' },
            ]}
          />
        </CustomFormItem>
      </CustomCol>
      <CustomCol {...defaultBreakpoints}>
        <CustomFormItem
          label={'Rol.'}
          name={'ROLE_ID'}
          rules={[{ required: true }]}
        >
          <CustomSelect
            onSearch={setSearchKey}
            loading={isGetRolesPending}
            placeholder={'Seleccionar Rol'}
            options={roleList.map((rol) => ({
              label: rol.NAME,
              value: rol.ROLE_ID,
            }))}
          />
        </CustomFormItem>
      </CustomCol>
      <CustomCol {...defaultBreakpoints}>
        <CustomFormItem
          label={'Usuario'}
          name={'USERNAME'}
          rules={[{ required: roleId !== 2 }]}
        >
          <CustomInput
            readOnly={isEditing}
            disabled={roleId === 2}
            placeholder={'Nombre de Usuario'}
          />
        </CustomFormItem>
      </CustomCol>
    </CustomRow>
  )
}

export default GeneralData
