import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Form } from 'antd'
import CustomModal from 'src/components/custom/CustomModal'
import CustomForm from 'src/components/custom/CustomForm'
import CustomFormItem from 'src/components/custom/CustomFormItem'
import CustomTextArea from 'src/components/custom/CustomTextArea'
import CustomSelect from 'src/components/custom/CustomSelect'
import CustomDatePicker from 'src/components/custom/CustomDatePicker'
import CustomRow from 'src/components/custom/CustomRow'
import CustomCol from 'src/components/custom/CustomCol'
import CustomDivider from 'src/components/custom/CustomDivider'
import CustomSpin from 'src/components/custom/CustomSpin'
import {
  formItemLayout,
  defaultBreakpoints,
  labelColFullWidth,
} from 'src/config/breakpoints'
import {
  FollowUp,
  FollowUpPayload,
  FollowUpStatus,
} from 'src/services/follow-up/follow-up.types'
import { useCreateFollowUpMutation } from 'src/services/follow-up/useCreateFollowUpMutation'
import { useUpdateFollowUpMutation } from 'src/services/follow-up/useUpdateFollowUpMutation'
import { useAppNotification } from 'src/context/NotificationContext'
import { useErrorHandler } from 'src/hooks/use-error-handler'
import dayjs, { Dayjs } from 'dayjs'
import { useGetStudentPaginationMutation } from 'src/services/students/useGetStudentPaginationMutation'
import { useStudentStore } from 'src/store/students.store'
import { useGetAppointmentPaginationMutation } from 'src/services/appointments/useGetAppointmentPaginationMutation'
import { useAppointmentStore } from 'src/store/appointment.store'
import useDebounce from 'src/hooks/use-debounce'
import { AdvancedCondition } from 'src/types/general'

type FollowUpFormValues = Omit<
  FollowUpPayload,
  'FOLLOW_UP_DATE' | 'NEXT_APPOINTMENT'
> & {
  FOLLOW_UP_DATE?: Dayjs
  NEXT_APPOINTMENT?: Dayjs | null
}

const statusOptions: { label: string; value: FollowUpStatus }[] = [
  { label: 'Abierto', value: 'open' },
  { label: 'Completado', value: 'completed' },
  { label: 'Cancelado', value: 'cancelled' },
]

interface FollowUpFormProps {
  open?: boolean
  followUp?: FollowUp
  onClose?: () => void
  onSuccess?: () => void
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({
  open,
  followUp,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<FollowUpFormValues>()
  const [errorHandler] = useErrorHandler()
  const notify = useAppNotification()
  const { students } = useStudentStore()
  const { appointments } = useAppointmentStore()
  const [studentSearch, setStudentSearch] = useState('')
  const [appointmentSearch, setAppointmentSearch] = useState('')
  const debounceStudent = useDebounce(studentSearch)
  const debounceAppointment = useDebounce(appointmentSearch)

  const { mutateAsync: createFollowUp, isPending: isCreatePending } =
    useCreateFollowUpMutation()
  const { mutateAsync: updateFollowUp, isPending: isUpdatePending } =
    useUpdateFollowUpMutation()
  const { mutate: getStudents, isPending: isGetStudentsPending } =
    useGetStudentPaginationMutation()
  const { mutate: getAppointments, isPending: isGetAppointmentsPending } =
    useGetAppointmentPaginationMutation()

  useEffect(() => {
    if (followUp && open) {
      form.setFieldsValue({
        ...followUp,
        FOLLOW_UP_DATE: dayjs(followUp.FOLLOW_UP_DATE),
        NEXT_APPOINTMENT: followUp.NEXT_APPOINTMENT
          ? dayjs(followUp.NEXT_APPOINTMENT)
          : undefined,
      })
    } else if (open) {
      form.resetFields()
      form.setFieldsValue({
        STATUS: 'open',
        FOLLOW_UP_DATE: dayjs(),
      })
    }
  }, [followUp, open])

  const studentOptions = useMemo(
    () =>
      students.map((student) => ({
        value: student.STUDENT_ID,
        label: `${student.NAME} ${student.LAST_NAME} (${student.UNIVERSITY})`,
      })),
    [students]
  )

  const appointmentOptions = useMemo(
    () =>
      appointments.map((appointment) => ({
        value: appointment.APPOINTMENT_ID,
        label: `${dayjs(appointment.START_AT).format('DD/MM/YYYY HH:mm')} - ${
          appointment.TITLE
        }`,
      })),
    [appointments]
  )

  const fetchStudents = useCallback(() => {
    if (!open) return
    const condition: AdvancedCondition[] = [
      { field: 'STATE', operator: '=', value: 'A' },
    ]

    if (debounceStudent) {
      condition.push({
        field: 'FILTER',
        operator: 'LIKE',
        value: debounceStudent,
      })
    }

    getStudents({ page: 1, size: 20, condition })
  }, [open, debounceStudent, getStudents])

  const fetchAppointments = useCallback(() => {
    if (!open) return
    const condition: AdvancedCondition[] = []

    if (debounceAppointment) {
      condition.push({
        field: 'TITLE',
        operator: 'LIKE',
        value: debounceAppointment,
      })
    }

    getAppointments({ page: 1, size: 20, condition })
  }, [open, debounceAppointment, getAppointments])

  useEffect(fetchStudents, [fetchStudents])
  useEffect(fetchAppointments, [fetchAppointments])

  const handleAppointmentChange = (appointmentId?: number) => {
    const appointment = appointments.find(
      (item) => item.APPOINTMENT_ID === Number(appointmentId)
    )

    if (appointment?.STUDENT_ID) {
      form.setFieldsValue({ STUDENT_ID: appointment.STUDENT_ID })
    }
  }

  const handleFinish = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        FOLLOW_UP_DATE: values.FOLLOW_UP_DATE?.toISOString(),
        NEXT_APPOINTMENT: values.NEXT_APPOINTMENT
          ? values.NEXT_APPOINTMENT.toISOString()
          : null,
      }

      if (followUp?.FOLLOW_UP_ID) {
        await updateFollowUp({
          ...payload,
          FOLLOW_UP_ID: followUp.FOLLOW_UP_ID,
        } as FollowUp)
        notify({
          message: 'Operación exitosa',
          description: 'Seguimiento actualizado correctamente.',
        })
      } else {
        await createFollowUp(payload)
        notify({
          message: 'Operación exitosa',
          description: 'Seguimiento registrado correctamente.',
        })
      }

      form.resetFields()
      onSuccess?.()
      onClose?.()
    } catch (error) {
      errorHandler(error)
    }
  }

  return (
    <CustomModal
      open={open}
      onCancel={onClose}
      onOk={handleFinish}
      width={'45%'}
      title={followUp ? 'Editar seguimiento' : 'Nuevo seguimiento'}
    >
      <CustomSpin
        spinning={
          isCreatePending ||
          isUpdatePending ||
          isGetStudentsPending ||
          isGetAppointmentsPending
        }
      >
        <CustomDivider />
        <CustomForm form={form} {...formItemLayout}>
          <CustomRow justify={'start'} gutter={[16, 8]}>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={'Becario'}
                name={'STUDENT_ID'}
                rules={[{ required: true }]}
                labelCol={{ span: 8 }}
              >
                <CustomSelect
                  placeholder={'Seleccionar becario'}
                  showSearch
                  filterOption={false}
                  options={studentOptions}
                  onSearch={setStudentSearch}
                  allowClear
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={'Cita'}
                name={'APPOINTMENT_ID'}
                labelCol={{ span: 8 }}
              >
                <CustomSelect
                  placeholder={'Seleccionar cita'}
                  showSearch
                  filterOption={false}
                  options={appointmentOptions}
                  onSearch={setAppointmentSearch}
                  onChange={handleAppointmentChange}
                  allowClear
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={'Fecha de seguimiento'}
                name={'FOLLOW_UP_DATE'}
                rules={[{ required: true }]}
              >
                <CustomDatePicker showTime width={'100%'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem label={'Próxima cita'} name={'NEXT_APPOINTMENT'}>
                <CustomDatePicker showTime style={{ width: '100%' }} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem
                label={'Resumen'}
                name={'SUMMARY'}
                rules={[{ required: true }]}
                {...labelColFullWidth}
              >
                <CustomTextArea
                  rows={3}
                  placeholder={'Resumen del seguimiento'}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem
                label={'Notas'}
                name={'NOTES'}
                {...labelColFullWidth}
              >
                <CustomTextArea rows={3} placeholder={'Notas adicionales'} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem label={'Estado'} name={'STATUS'}>
                <CustomSelect options={statusOptions} />
              </CustomFormItem>
            </CustomCol>
          </CustomRow>
        </CustomForm>
      </CustomSpin>
    </CustomModal>
  )
}

export default FollowUpForm
