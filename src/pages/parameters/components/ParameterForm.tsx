import React, { useEffect, useMemo } from 'react'
import { Form } from 'antd'
import CustomModal from 'src/components/custom/CustomModal'
import CustomForm from 'src/components/custom/CustomForm'
import CustomFormItem from 'src/components/custom/CustomFormItem'
import CustomInput from 'src/components/custom/CustomInput'
import CustomTextArea from 'src/components/custom/CustomTextArea'
import CustomRow from 'src/components/custom/CustomRow'
import CustomCol from 'src/components/custom/CustomCol'
import CustomDivider from 'src/components/custom/CustomDivider'
import { formItemLayout } from 'src/config/breakpoints'
import { Parameter } from 'src/services/parameter/parameter.types'
import { useCreateParameterMutation } from 'src/services/parameter/useCreateParameterMutation'
import { useUpdateParameterMutation } from 'src/services/parameter/useUpdateParameterMutation'
import { useErrorHandler } from 'src/hooks/use-error-handler'
import CustomSpin from 'src/components/custom/CustomSpin'
import { useMenuOptionStore } from 'src/store/menu-options.store'
import { useAppNotification } from 'src/context/NotificationContext'
import { useGetMenuOptionsWithPermissions } from 'src/services/menu-options/useGetMenuOptionsWithPermissions'
import { AdvancedCondition } from 'src/types/general'
import CustomTreeSelect from 'src/components/custom/CustomTreeSelect'
import CustomSelect from 'src/components/custom/CustomSelect'

interface ParameterFormProps {
  open?: boolean
  parameter?: Parameter
  onClose?: () => void
  onSuccess?: () => void
}

const ParameterForm: React.FC<ParameterFormProps> = ({
  open,
  parameter,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<Parameter>()
  const [errorHandler] = useErrorHandler()
  const notify = useAppNotification()
  const { menuOptionsWithPermissions } = useMenuOptionStore()

  const { mutateAsync: createParameter, isPending: isCreatePending } =
    useCreateParameterMutation()
  const { mutateAsync: updateParameter, isPending: isUpdatePending } =
    useUpdateParameterMutation()
  const { mutate: getMenuOptionsWithPermissions, isPending: isOptionsPending } =
    useGetMenuOptionsWithPermissions()

  const handleGetMenuOptions = React.useCallback(() => {
    const condition: AdvancedCondition[] = [
      { field: 'STATE', operator: '=', value: 'A' },
    ]

    getMenuOptionsWithPermissions({ page: 1, size: 200, condition })
  }, [getMenuOptionsWithPermissions])

  useEffect(() => {
    if (open) {
      handleGetMenuOptions()
    }
  }, [open, handleGetMenuOptions])

  const menuOptionsList = useMemo(() => {
    if (!menuOptionsWithPermissions?.length) return []

    return menuOptionsWithPermissions.map((item) => ({
      title: item.NAME,
      value: item.MENU_OPTION_ID,
      key: item.MENU_OPTION_ID,
      children:
        item?.CHILDREN?.map((child) => ({
          title: child.NAME,
          value: child.MENU_OPTION_ID,
          key: child.MENU_OPTION_ID,
        })) ?? [],
    }))
  }, [menuOptionsWithPermissions])

  useEffect(() => {
    if (parameter && open) {
      form.setFieldsValue({
        ...parameter,
      })
    } else if (open) {
      form.resetFields()
      form.setFieldValue('STATE', 'A')
    }
  }, [parameter, open])

  const handleFinish = async () => {
    try {
      const data = await form.validateFields()

      if (parameter?.PARAMETER_ID) {
        await updateParameter({
          ...data,
          PARAMETER_ID: parameter.PARAMETER_ID,
        })
        notify({
          message: 'Operación exitosa',
          description: 'Parámetro actualizado correctamente.',
        })
      } else {
        await createParameter(data)
        notify({
          message: 'Operación exitosa',
          description: 'Parámetro creado correctamente.',
        })
      }

      form.resetFields()
      onClose?.()
      onSuccess?.()
    } catch (error) {
      errorHandler(error)
    }
  }

  return (
    <CustomModal
      open={open}
      onCancel={onClose}
      onOk={handleFinish}
      width={'40%'}
      title={parameter ? 'Editar parámetro' : 'Registrar nuevo parámetro'}
    >
      <CustomSpin
        spinning={isCreatePending || isUpdatePending || isOptionsPending}
      >
        <CustomDivider />
        <CustomForm form={form} {...formItemLayout}>
          <CustomRow gutter={[16, 8]}>
            <CustomCol xs={24}>
              <CustomFormItem
                label={'Opción de menú'}
                name={'MENU_OPTION_ID'}
                rules={[{ required: true }]}
              >
                <CustomTreeSelect
                  treeData={menuOptionsList}
                  placeholder={'Seleccionar opción'}
                  treeDefaultExpandAll
                  showSearch
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem
                uppercase
                label={'Parámetro'}
                name={'PARAMETER'}
                rules={[{ required: true }]}
                noSpaces
              >
                <CustomInput placeholder={'Ej: ID_LIST_STATES'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem label={'Descripción'} name={'DESCRIPTION'}>
                <CustomInput placeholder={'Descripción del parámetro'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem label={'Valor'} name={'VALUE'}>
                <CustomTextArea
                  rows={1}
                  placeholder={'Valor'}
                  showCount={false}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem label={'Estado'} name={'STATE'}>
                <CustomSelect
                  placeholder={'Seleccionar estado'}
                  options={[
                    { label: 'Activo', value: 'A' },
                    { label: 'Inactivo', value: 'I' },
                  ]}
                />
              </CustomFormItem>
            </CustomCol>
          </CustomRow>
        </CustomForm>
      </CustomSpin>
    </CustomModal>
  )
}

export default ParameterForm
