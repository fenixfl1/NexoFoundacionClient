import React, { useEffect } from 'react'
import { Form } from 'antd'
import CustomModal from 'src/components/custom/CustomModal'
import CustomForm from 'src/components/custom/CustomForm'
import CustomFormItem from 'src/components/custom/CustomFormItem'
import CustomInput from 'src/components/custom/CustomInput'
import CustomTextArea from 'src/components/custom/CustomTextArea'
import CustomRow from 'src/components/custom/CustomRow'
import CustomCol from 'src/components/custom/CustomCol'
import CustomDivider from 'src/components/custom/CustomDivider'
import CustomSpin from 'src/components/custom/CustomSpin'
import CustomSelect from 'src/components/custom/CustomSelect'
import {
  formItemLayout,
  defaultBreakpoints,
  labelColFullWidth,
} from 'src/config/breakpoints'
import { Sponsor } from 'src/services/sponsors/sponsor.types'
import { useCreateSponsorMutation } from 'src/services/sponsors/useCreateSponsorMutation'
import { useUpdateSponsorMutation } from 'src/services/sponsors/useUpdateSponsorMutation'
import { useErrorHandler } from 'src/hooks/use-error-handler'
import { useAppNotification } from 'src/context/NotificationContext'

interface SponsorFormProps {
  open?: boolean
  sponsor?: Sponsor
  onClose?: () => void
  onSuccess?: () => void
}

const sponsorTypeOptions = [
  { label: 'Empresa', value: 'company' },
  { label: 'Persona', value: 'person' },
  { label: 'Fundación', value: 'foundation' },
  { label: 'ONG', value: 'ngo' },
  { label: 'Otro', value: 'other' },
]

const SponsorForm: React.FC<SponsorFormProps> = ({
  open,
  sponsor,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<Sponsor>()
  const [errorHandler] = useErrorHandler()
  const notify = useAppNotification()

  const { mutateAsync: createSponsor, isPending: isCreatePending } =
    useCreateSponsorMutation()
  const { mutateAsync: updateSponsor, isPending: isUpdatePending } =
    useUpdateSponsorMutation()

  useEffect(() => {
    if (sponsor && open) {
      form.setFieldsValue({ ...sponsor })
    } else if (open) {
      form.resetFields()
      form.setFieldValue('STATE', 'A')
    }
  }, [sponsor, open])

  const handleFinish = async () => {
    try {
      const data = await form.validateFields()

      if (sponsor?.SPONSOR_ID) {
        await updateSponsor({
          ...data,
          SPONSOR_ID: sponsor.SPONSOR_ID,
        })
        notify({
          message: 'Operación exitosa',
          description: 'Patrocinador actualizado correctamente.',
        })
      } else {
        await createSponsor(data)
        notify({
          message: 'Operación exitosa',
          description: 'Patrocinador creado correctamente.',
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
      width={'50%'}
      title={sponsor ? 'Editar patrocinador' : 'Registrar patrocinador'}
    >
      <CustomSpin spinning={isCreatePending || isUpdatePending}>
        <CustomDivider />
        <CustomForm form={form} {...formItemLayout}>
          <CustomRow gutter={[16, 8]}>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={'Nombre'}
                name={'NAME'}
                rules={[{ required: true }]}
              >
                <CustomInput placeholder={'Nombre del patrocinador'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem label={'Tipo'} name={'TYPE'}>
                <CustomSelect
                  placeholder={'Seleccionar tipo'}
                  options={sponsorTypeOptions}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem label={'RNC / ID'} name={'TAX_ID'}>
                <CustomInput placeholder={'RNC o documento'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem label={'Contacto'} name={'CONTACT_NAME'}>
                <CustomInput placeholder={'Nombre del contacto'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem label={'Correo'} name={'CONTACT_EMAIL'}>
                <CustomInput placeholder={'correo@dominio.com'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem label={'Teléfono'} name={'CONTACT_PHONE'}>
                <CustomInput placeholder={'(809) 555-0000'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem
                label={'Dirección'}
                name={'ADDRESS'}
                {...labelColFullWidth}
              >
                <CustomTextArea rows={2} placeholder={'Dirección'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem
                label={'Notas'}
                name={'NOTES'}
                {...labelColFullWidth}
              >
                <CustomTextArea rows={2} placeholder={'Notas'} />
              </CustomFormItem>
            </CustomCol>
          </CustomRow>
        </CustomForm>
      </CustomSpin>
    </CustomModal>
  )
}

export default SponsorForm
