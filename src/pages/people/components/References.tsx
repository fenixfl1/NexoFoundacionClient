import { Form } from 'antd'
import React, { useEffect, useState } from 'react'
import ConditionalComponent from 'src/components/ConditionalComponent'
import CustomTable from 'src/components/custom/CustomTable'
import { Reference } from 'src/services/people/people.types'
import ReferenceForm from './ReferenceForm'
import CustomRow from 'src/components/custom/CustomRow'
import CustomCol from 'src/components/custom/CustomCol'
import CustomSearch from 'src/components/custom/CustomSearch'
import CustomButton from 'src/components/custom/CustomButton'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import CustomCard from 'src/components/custom/CustomCard'
import { ColumnsType } from 'antd/lib/table'
import formatter from 'src/utils/formatter'
import { useErrorHandler } from 'src/hooks/use-error-handler'
import CustomSpace from 'src/components/custom/CustomSpace'
import CustomDivider from 'src/components/custom/CustomDivider'
import CustomTooltip from 'src/components/custom/CustomTooltip'
import { usePeopleStore } from 'src/store/people.store'

interface ReferencesProps {
  onCreate: (data: Reference) => void
}

const References: React.FC<ReferencesProps> = ({ onCreate }) => {
  const [form] = Form.useForm<{ REFERENCE: Reference }>()

  const [errorHandler] = useErrorHandler()

  const [modalState, setModalState] = useState(false)
  const [dataSource, setDataSource] = useState<Reference[]>([])

  const { person } = usePeopleStore()

  const toggleModalState = () => setModalState(!modalState)

  useEffect(() => {
    if (person?.PERSON_ID) {
      setDataSource(person.REFERENCES ?? [])
    }
  }, [person])

  const handleCreate = async () => {
    try {
      const data = await form.validateFields()
      onCreate(data.REFERENCE)
      setDataSource((prev) => [...prev, data.REFERENCE])
      form.resetFields(['REFERENCE'])
      toggleModalState()
    } catch (error) {
      errorHandler(error)
    }
  }

  const columns: ColumnsType<Reference> = [
    {
      dataIndex: 'FULL_NAME',
      key: 'FULL_NAME',
      title: 'Nombre',
    },
    {
      dataIndex: 'RELATIONSHIP',
      key: 'RELATIONSHIP',
      title: 'Relación',
    },
    {
      dataIndex: 'PHONE',
      key: 'PHONE',
      title: 'Teléfono',
      render: (value) => formatter({ value, format: 'phone' }),
    },
    {
      dataIndex: 'EMAIL',
      key: 'EMAIL',
      title: 'Correo',
    },
    {
      dataIndex: 'ACTIONS',
      key: 'ACTIONS',
      title: 'Acciones',
      width: '5%',
      align: 'center',
      render: () => (
        <CustomSpace
          direction={'horizontal'}
          split={<CustomDivider style={{ margin: 0 }} type={'vertical'} />}
        >
          <CustomTooltip title={'Editar'}>
            <CustomButton icon={<EditOutlined />} type={'link'} />
          </CustomTooltip>
          <CustomTooltip title={'Remover'}>
            <CustomButton danger icon={<DeleteOutlined />} type={'link'} />
          </CustomTooltip>
        </CustomSpace>
      ),
    },
  ]

  return (
    <>
      <CustomCard>
        <CustomRow justify={'end'} gutter={[16, 16]} gap={10}>
          <CustomCol xs={10}>
            <CustomSearch placeholder={'Buscar referencia...'} />
          </CustomCol>
          <CustomButton
            icon={<PlusOutlined />}
            type={'primary'}
            onClick={toggleModalState}
          >
            Agregar Referencia
          </CustomButton>
          <CustomCol xs={24}>
            <CustomTable columns={columns} dataSource={dataSource} />
          </CustomCol>
        </CustomRow>
      </CustomCard>

      <ConditionalComponent condition={modalState}>
        <ReferenceForm
          form={form}
          open={modalState}
          onClose={toggleModalState}
          onOk={handleCreate}
        />
      </ConditionalComponent>
    </>
  )
}

export default References
