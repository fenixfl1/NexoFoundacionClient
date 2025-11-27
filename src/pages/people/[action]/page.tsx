import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SaveOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { App, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import ConditionalComponent from 'src/components/ConditionalComponent'
import CustomButton from 'src/components/custom/CustomButton'
import CustomCol from 'src/components/custom/CustomCol'
import CustomForm from 'src/components/custom/CustomFrom'
import CustomRow from 'src/components/custom/CustomRow'
import CustomSpace from 'src/components/custom/CustomSpace'
import CustomSpin from 'src/components/custom/CustomSpin'
import CustomSteps from 'src/components/custom/CustomSteps'
import { formItemLayout } from 'src/config/breakpoints'
import GeneralData from '../components/GeneralData'
import CustomCard from 'src/components/custom/CustomCard'
import CustomDivider from 'src/components/custom/CustomDivider'
import Contacts from '../components/Contacts'
import metadata from './page.meta'
import References from '../components/References'
import { PersonPayload, Reference } from 'src/services/people/people.types'
import { ContactType } from 'src/services/contact/contact.types'
import { useErrorHandler } from 'src/hooks/use-error-handler'
import { useCreatePersonMutation } from 'src/services/people/useCreatePersonMutation'
import { useNavigate } from 'react-router-dom'

enum StepKeys {
  STEP_1 = 'personal_data',
  STEP_2 = 'contacts',
  STEP_3 = 'references',
}

const Page: React.FC = () => {
  const { modal } = App.useApp()
  const [errorHandler] = useErrorHandler()
  const navigate = useNavigate()
  const [form] = Form.useForm<PersonPayload>()
  const [current, setCurrent] = useState(0)
  const [formState, setFormState] = useState<PersonPayload>()

  const { mutateAsync: createPerson, isPending: isCreatePersonPending } =
    useCreatePersonMutation()

  useEffect(() => {
    document.title = metadata.title
  }, [])

  const handleCreateReference = (reference: Reference) => {
    setFormState((prev) => {
      const references = prev.REFERENCES ?? []

      return { ...prev, REFERENCES: [...references, reference] }
    })
  }

  const steps = [
    {
      key: StepKeys.STEP_1,
      title: 'Datos personales',
      content: <GeneralData form={form} />,
    },
    {
      key: StepKeys.STEP_2,
      title: 'Información de Contacto',
      content: <Contacts form={form} />,
    },
    {
      key: StepKeys.STEP_3,
      title: 'Información de Contacto',
      content: <References onCreate={handleCreateReference} />,
    },
  ]

  const handleCreatePerson = async () => {
    try {
      await createPerson(formState)

      const message = formState.USERNAME
        ? 'Le hemos enviado un correo electrónico al usuario creado con información para acceder aḷ sistema'
        : ''

      modal.success({
        title: 'Registro completado',
        content: `El registro fue completado exitosamente. ${message}`,
        onOk: () => navigate(-1),
      })
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleNext = async () => {
    try {
      const values = await form.validateFields()

      switch (steps[current].key) {
        case StepKeys.STEP_1: {
          setFormState(values)
          break
        }
        case StepKeys.STEP_2: {
          setFormState({
            ...formState,
            CONTACTS: [
              ...values[ContactType.EMAIL],
              ...values[ContactType.PHONE],
            ],
          })
          break
        }
        case StepKeys.STEP_3: {
          handleCreatePerson()
          break
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

  return (
    <CustomSpin spinning={isCreatePersonPending}>
      <CustomCard>
        <CustomCol xs={24}>
          <CustomSteps onChange={setCurrent} current={current} items={steps} />
          <CustomDivider />
          <CustomForm form={form} {...formItemLayout}>
            <CustomSpace size={'large'}>
              {steps[current].content}
              <CustomCol xs={24}>
                <CustomRow justify={'space-between'}>
                  <CustomCol>
                    <CustomRow justify={'start'} gap={10}>
                      <CustomButton danger icon={<StopOutlined />}>
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
                    {current === steps.length - 1 ? 'Finalizer' : 'Continuar'}
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
