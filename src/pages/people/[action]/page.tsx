import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SaveOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { Form } from 'antd'
import React, { useEffect, useState } from 'react'
import ConditionalComponent from 'src/components/ConditionalComponent'
import CustomButton from 'src/components/custom/CustomButton'
import CustomCol from 'src/components/custom/CustomCol'
import CustomForm from 'src/components/custom/CustomForm'
import CustomRow from 'src/components/custom/CustomRow'
import CustomSpace from 'src/components/custom/CustomSpace'
import CustomSpin from 'src/components/custom/CustomSpin'
import CustomSteps from 'src/components/custom/CustomSteps'
import { formItemLayout } from 'src/config/breakpoints'
import GeneralData from '../components/GeneralData'
import CustomCard from 'src/components/custom/CustomCard'
import Contacts from '../components/Contacts'
import References from '../components/References'
import { PersonPayload, Reference } from 'src/services/people/people.types'
import { Contact, ContactType } from 'src/services/contact/contact.types'
import { useErrorHandler } from 'src/hooks/use-error-handler'
import { useCreatePersonMutation } from 'src/services/people/useCreatePersonMutation'
import { useNavigate, useParams } from 'react-router-dom'
import StudentData from '../components/StudentData'
import CustomFormItem from 'src/components/custom/CustomFormItem'
import { useGetMultiCatalogList } from 'src/hooks/use-get-multi-catalog-list'
import { useCustomModal } from 'src/hooks/use-custom-modal'
import { usePeopleStore } from 'src/store/people.store'
import dayjs from 'dayjs'
import { useUpdatePersonMutation } from 'src/services/people/useUpdatePersonMutation'
import { useCustomNotifications } from 'src/hooks/use-custom-notification'
import { useGeneralStore } from 'src/store/general.store'
import { useUpdateStudentMutation } from 'src/services/students/useCreateStudentMutation'

enum StepKeys {
  PERSONAL = 'personal_data',
  CONTACTS = 'contacts',
  STUDENT = 'student_data',
  REFERENCES = 'references',
}

const STUDENT_ROLE_ID = 3

const Page: React.FC = () => {
  const [errorHandler] = useErrorHandler()
  const { confirmModal, successModal } = useCustomModal()
  const { successNotification } = useCustomNotifications()
  const navigate = useNavigate()
  const [form] = Form.useForm<PersonPayload>()
  const [current, setCurrent] = useState(0)
  const [formState, setFormState] = useState<PersonPayload>()
  const roleId = Form.useWatch('ROLE_ID', form)

  useGetMultiCatalogList()

  const { action } = useParams()

  const { mutateAsync: createPerson, isPending: isCreatePersonPending } =
    useCreatePersonMutation()
  const { mutateAsync: updatePerson, isPending: isUpdatePersonPending } =
    useUpdatePersonMutation()
  const { mutateAsync: updateStudent, isPending: isUpdateStudentPending } =
    useUpdateStudentMutation()

  const { person, reset } = usePeopleStore()
  const { setTitle } = useGeneralStore()

  const isEditing = action === 'edit'

  useEffect(() => {
    return () => {
      setTitle('')
    }
  }, [])

  useEffect(() => {
    if (isEditing) {
      const contacts = person.CONTACTS?.reduce((acc, contact) => {
        const type = contact.TYPE

        if (!acc[type]) {
          acc[type] = []
        }

        acc[type].push(contact)
        return acc
      }, {} as Record<ContactType, Contact[]>)

      form.setFieldsValue({
        ...person,
        ...contacts,
        REFERENCES: person.REFERENCES,
        BIRTH_DATE: (person.BIRTH_DATE
          ? dayjs(person.BIRTH_DATE)
          : null) as never,
      })
    }
  }, [person])

  const handleResetState = () => {
    setFormState(undefined)
    reset()
    navigate(-1)
  }

  const handleCreateReference = (reference: Reference) => {
    setFormState((prev) => {
      const references = prev?.REFERENCES ?? []

      return {
        ...(prev ?? {}),
        REFERENCES: [...references, reference],
      } as never
    })
  }

  const isStudent = Number(roleId) === STUDENT_ROLE_ID

  const steps = [
    {
      key: StepKeys.PERSONAL,
      title: 'Datos personales',
      content: <GeneralData form={form} />,
    },
    {
      key: StepKeys.CONTACTS,
      title: 'Información de contacto',
      content: <Contacts form={form} />,
    },
    ...(isStudent
      ? [
          {
            key: StepKeys.STUDENT,
            title: 'Datos del estudiante',
            content: <StudentData form={form} />,
          },
        ]
      : []),
    {
      key: StepKeys.REFERENCES,
      title: 'Referencias',
      content: <References onCreate={handleCreateReference} />,
    },
  ]

  const handleCreatePerson = async () => {
    try {
      if (!formState) {
        throw new Error('Datos incompletos en el formulario.')
      }

      const payload: PersonPayload = {
        ...formState,
        CONTACTS: formState.CONTACTS ?? [],
        REFERENCES: formState.REFERENCES ?? [],
        STUDENT:
          Number(formState.ROLE_ID) === STUDENT_ROLE_ID
            ? formState.STUDENT
            : undefined,
      }

      await createPerson(payload)

      const message = payload.USERNAME
        ? 'Le hemos enviado un correo electrónico al usuario creado con información para acceder al sistema'
        : ''

      successModal({
        title: 'Registro completado',
        content: `El registro fue completado exitosamente. ${message}`,
        onOk: handleResetState,
      })
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdatePerson = async () => {
    try {
      const values = await form.validateFields()

      values.IDENTITY_DOCUMENT = values.IDENTITY_DOCUMENT.replace(/\D/g, '')

      delete values.USERNAME

      const { message, data } = await updatePerson(values)

      successNotification({ message })
      setFormState((prev) => ({ ...(prev ?? {}), ...data } as never))
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateStudent = async () => {
    const values = await form.validateFields()

    await updateStudent(values.STUDENT)
    successNotification({
      message: 'Información académica actualizada exitosamente.',
    })
  }

  const handleNext = async () => {
    try {
      const values = await form.validateFields()

      const basePersonData: Partial<PersonPayload> = {
        NAME: values.NAME,
        LAST_NAME: values.LAST_NAME,
        GENDER: values.GENDER,
        BIRTH_DATE: values.BIRTH_DATE,
        IDENTITY_DOCUMENT: values.IDENTITY_DOCUMENT?.replace(/\D/g, ''),
        ROLE_ID: values.ROLE_ID,
        USERNAME: values.USERNAME,
        PASSWORD: values.PASSWORD,
      }

      switch (steps[current].key) {
        case StepKeys.PERSONAL: {
          if (isEditing) {
            await handleUpdatePerson()
          } else {
            setFormState(
              (prev) => ({ ...(prev ?? {}), ...basePersonData } as never)
            )
          }

          break
        }
        case StepKeys.CONTACTS: {
          setFormState(
            (prev) =>
              ({
                ...(prev ?? {}),
                ...basePersonData,
                CONTACTS: [
                  ...(values[ContactType.EMAIL] ?? []),
                  ...(values[ContactType.PHONE] ?? []),
                ],
              } as never)
          )
          break
        }
        case StepKeys.STUDENT: {
          if (isEditing) {
            await handleUpdateStudent()
          }
          setFormState(
            (prev) =>
              ({
                ...(prev ?? {}),
                ...basePersonData,
                STUDENT: values.STUDENT,
              } as never)
          )
          break
        }
        case StepKeys.REFERENCES: {
          if (isEditing) {
            return handleResetState()
          }

          handleCreatePerson()
          return
        }
        default:
          break
      }

      if (current < steps.length - 1) {
        setCurrent(current + 1)
      }
    } catch (error) {
      errorHandler(error)
    }
  }

  const handlePrev = () => {
    setCurrent(current - 1)
  }

  const handleCancel = () => {
    confirmModal({
      title: 'Confirmación',
      okText: 'Cancelar',
      onOk: () => {
        navigate(-1)
      },
      content: (
        <div>
          <p>
            Si cancelas ahora perderás cualquier información que halla
            introducido. <br />
          </p>
          <p>¿Desea cancelar?</p>
        </div>
      ),
    })
  }

  return (
    <CustomSpin
      spinning={
        isCreatePersonPending || isUpdatePersonPending || isUpdateStudentPending
      }
    >
      <CustomCard>
        <CustomCol xs={24}>
          <CustomSteps onChange={setCurrent} current={current} items={steps} />
          <CustomForm form={form} {...formItemLayout}>
            <CustomFormItem hidden name={'ROLE_ID'} />
            <div style={{ width: '100%', margin: '45px 0' }} />
            <CustomSpace size={'large'}>
              {steps[current].content}
              <CustomCol xs={24}>
                <CustomRow justify={'space-between'}>
                  <CustomCol>
                    <CustomRow justify={'start'} gap={10}>
                      <CustomButton
                        danger
                        icon={<StopOutlined />}
                        onClick={handleCancel}
                      >
                        Cancelar
                      </CustomButton>
                      <ConditionalComponent condition={current > 0}>
                        <CustomButton
                          icon={<ArrowLeftOutlined />}
                          onClick={handlePrev}
                        >
                          Volver
                        </CustomButton>
                      </ConditionalComponent>
                    </CustomRow>
                  </CustomCol>
                  <CustomButton
                    onClick={handleNext}
                    type={'primary'}
                    icon={
                      current === steps.length - 1 ? (
                        <SaveOutlined />
                      ) : (
                        <ArrowRightOutlined />
                      )
                    }
                  >
                    {current === steps.length - 1
                      ? 'Finalizar'
                      : isEditing
                      ? 'Actualizar y Continuar'
                      : 'Continuar'}
                  </CustomButton>
                </CustomRow>
              </CustomCol>
            </CustomSpace>
          </CustomForm>
        </CustomCol>
      </CustomCard>
    </CustomSpin>
  )
}

export default Page
