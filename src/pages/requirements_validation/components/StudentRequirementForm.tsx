import React, { useEffect } from 'react'
import { Form } from 'antd'
import CustomModal from 'src/components/custom/CustomModal'
import CustomForm from 'src/components/custom/CustomForm'
import CustomFormItem from 'src/components/custom/CustomFormItem'
import CustomTextArea from 'src/components/custom/CustomTextArea'
import CustomRow from 'src/components/custom/CustomRow'
import CustomCol from 'src/components/custom/CustomCol'
import CustomDivider from 'src/components/custom/CustomDivider'
import CustomSpin from 'src/components/custom/CustomSpin'
import CustomSelect from 'src/components/custom/CustomSelect'
import { formItemLayout } from 'src/config/breakpoints'
import { StudentRequirement } from 'src/services/student-requirements/student-requirement.types'
import { useUpdateStudentRequirementMutation } from 'src/services/student-requirements/useUpdateStudentRequirementMutation'
import { useErrorHandler } from 'src/hooks/use-error-handler'
import { useAppNotification } from 'src/context/NotificationContext'
import { requirementStatusOptions } from '../constants'

interface StudentRequirementFormProps {
  open?: boolean
  requirement?: StudentRequirement
  onClose?: () => void
  onSuccess?: () => void
}

const StudentRequirementForm: React.FC<StudentRequirementFormProps> = ({
  open,
  requirement,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<StudentRequirement>()
  const [errorHandler] = useErrorHandler()
  const notify = useAppNotification()

  const { mutateAsync: updateRequirement, isPending: isUpdatePending } =
    useUpdateStudentRequirementMutation()

  useEffect(() => {
    if (requirement && open) {
      form.setFieldsValue({ ...requirement })
    } else if (open) {
      form.resetFields()
    }
  }, [requirement, open])

  const handleFinish = async () => {
    try {
      const data = await form.validateFields()

      if (!requirement?.STUDENT_REQUIREMENT_ID) {
        return
      }

      await updateRequirement({
        ...data,
        STUDENT_REQUIREMENT_ID: requirement.STUDENT_REQUIREMENT_ID,
      })

      notify({
        message: 'Operación exitosa',
        description: 'Validación actualizada correctamente.',
      })

      form.resetFields()
      onClose?.()
      onSuccess?.()
    } catch (error) {
      errorHandler(error)
    }
  }

  const title = requirement
    ? `Validar ${requirement.NAME} ${requirement.LAST_NAME} · ${requirement.REQUIREMENT_NAME}`
    : 'Validar requisito'

  return (
    <CustomModal
      open={open}
      onCancel={onClose}
      onOk={handleFinish}
      width={'40%'}
      title={title}
    >
      <CustomSpin spinning={isUpdatePending}>
        <CustomDivider />
        <CustomForm form={form} {...formItemLayout}>
          <CustomRow gutter={[16, 8]}>
            <CustomCol xs={24}>
              <CustomFormItem
                label={'Estado'}
                name={'STATUS'}
                rules={[{ required: true }]}
              >
                <CustomSelect
                  placeholder={'Seleccionar estado'}
                  options={requirementStatusOptions}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem label={'Observación'} name={'OBSERVATION'}>
                <CustomTextArea
                  rows={3}
                  placeholder={'Notas o comentarios'}
                  showCount={false}
                />
              </CustomFormItem>
            </CustomCol>
          </CustomRow>
        </CustomForm>
      </CustomSpin>
    </CustomModal>
  )
}

export default StudentRequirementForm
