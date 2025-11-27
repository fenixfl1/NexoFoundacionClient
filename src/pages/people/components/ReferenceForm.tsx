import { App, FormInstance } from 'antd'
import React from 'react'
import CustomCol from 'src/components/custom/CustomCol'
import CustomDivider from 'src/components/custom/CustomDivider'
import CustomFormItem from 'src/components/custom/CustomFormItem'
import CustomForm from 'src/components/custom/CustomFrom'
import CustomInput from 'src/components/custom/CustomInput'
import CustomMaskedInput from 'src/components/custom/CustomMaskedInput'
import CustomModal from 'src/components/custom/CustomModal'
import CustomRow from 'src/components/custom/CustomRow'
import CustomSelect from 'src/components/custom/CustomSelect'
import CustomSpin from 'src/components/custom/CustomSpin'
import CustomTextArea from 'src/components/custom/CustomTextArea'
import {
  defaultBreakpoints,
  formItemLayout,
  labelColFullWidth,
} from 'src/config/breakpoints'

const relationships = [
  { label: 'Padre', value: 'padre' },
  { label: 'Madre', value: 'madre' },
  { label: 'Hijo(a)', value: 'hijo(a)' },
  { label: 'Hermano(a)', value: 'hermano(a)' },
  { label: 'Tío(a)', value: 'tio(a)' },
  { label: 'Sobrino(a)', value: 'sobrino(a)' },
  { label: 'Abuelo(a)', value: 'abuelo(a)' },
  { label: 'Primo(a)', value: 'primo(a)' },
  { label: 'Amigo(a)', value: 'amigo(a)' },
  { label: 'Novio(a)', value: 'novio(a)' },
  { label: 'Esposo(a)', value: 'esposo(a)' },
  { label: 'Compañero(a) de trabajo', value: 'companero(a)_trabajo' },
  { label: 'Vecino(a)', value: 'vecino(a)' },
  { label: 'Conocido(a)', value: 'conocido(a)' },
]

interface ReferenceFormProps {
  form: FormInstance
  open: boolean
  onClose?: () => void
  onOk?: () => void
}

const ReferenceForm: React.FC<ReferenceFormProps> = ({
  form,
  open,
  onClose,
  onOk,
}) => {
  const { modal } = App.useApp()
  const handleClose = () => {
    modal.confirm({
      title: 'Confirmación',
      content: 'Seguro que desea cerrar la ventana?',
      onOk: onClose,
    })
  }

  return (
    <CustomModal
      title={'Formulario de Referencias'}
      open={open}
      onCancel={handleClose}
      width={'45%'}
      onOk={onOk}
    >
      <CustomDivider />
      <CustomSpin>
        <CustomForm form={form} {...formItemLayout}>
          <CustomRow justify={'start'}>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={'Nombre'}
                name={['REFERENCE', 'FULL_NAME']}
                rules={[{ required: true }]}
              >
                <CustomInput placeholder={'Nombre completo'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={'Relación'}
                name={['REFERENCE', 'RELATIONSHIP']}
                rules={[{ required: true }]}
              >
                <CustomSelect
                  placeholder={'Seleccionar Relación'}
                  options={relationships}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={'Teléfono'}
                name={['REFERENCE', 'PHONE']}
                rules={[{ required: true }]}
              >
                <CustomMaskedInput
                  type={'phone'}
                  placeholder={'Número de Teléfono'}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={'Correo'}
                name={['REFERENCE', 'EMAIL']}
                rules={[{ type: 'email' }]}
              >
                <CustomInput placeholder={'Correo'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem
                label={'Dirección'}
                name={['REFERENCE', 'ADDRESS']}
                {...labelColFullWidth}
              >
                <CustomTextArea placeholder={'Dirección'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem
                label={'Nota'}
                name={['REFERENCE', 'NOTES']}
                {...labelColFullWidth}
              >
                <CustomTextArea placeholder={'Nota adicional'} />
              </CustomFormItem>
            </CustomCol>
          </CustomRow>
        </CustomForm>
      </CustomSpin>
    </CustomModal>
  )
}

export default ReferenceForm
