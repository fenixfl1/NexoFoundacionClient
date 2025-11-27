import React, { useEffect, useMemo, useState } from 'react'
import { CalendarOutlined, EyeOutlined } from '@ant-design/icons'
import CustomRow from 'src/components/custom/CustomRow'
import CustomCol from 'src/components/custom/CustomCol'
import CustomCard from 'src/components/custom/CustomCard'
import CustomStatistic from 'src/components/custom/CustomStatistic'
import CustomDivider from 'src/components/custom/CustomDivider'
import CustomSpin from 'src/components/custom/CustomSpin'
import SmartTable from 'src/components/SmartTable'
import CustomTag from 'src/components/custom/CustomTag'
import CustomButton from 'src/components/custom/CustomButton'
import CustomSpace from 'src/components/custom/CustomSpace'
import { ColumnsType } from 'antd/lib/table'
import { Student } from 'src/services/students/student.types'
import { useStudentStore } from 'src/store/students.store'
import StudentDrawer from './components/StudentDrawer'
import { CustomText } from 'src/components/custom/CustomParagraph'
import CustomTooltip from 'src/components/custom/CustomTooltip'
import formatter from 'src/utils/formatter'
import { useGetStudentPaginationMutation } from 'src/services/students/useGetStudentPaginationMutation'
import { AdvancedCondition } from 'src/types/general'

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Activa', color: 'green' },
  pending: { label: 'Pendiente', color: 'blue' },
  suspended: { label: 'En revisión', color: 'orange' },
  completed: { label: 'Finalizada', color: 'purple' },
  graduated: { label: 'Graduado', color: 'cyan' },
}

const StudentsPage: React.FC = () => {
  const [searchKey, setSearchKey] = useState('')
  const [pagination, setPagination] = useState({ page: 1, size: 10 })
  const { list, metadata, selected, drawerOpen, openDrawer, closeDrawer } =
    useStudentStore()

  const { mutate: getStudents, isPending } = useGetStudentPaginationMutation()

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [searchKey])

  useEffect(() => {
    const condition: AdvancedCondition[] = []

    if (searchKey) {
      condition.push({
        field: 'FILTER',
        operator: 'LIKE',
        value: searchKey,
      })
    }

    getStudents({
      page: pagination.page,
      size: pagination.size,
      condition,
    })
  }, [getStudents, pagination.page, pagination.size, searchKey])

  const summary = useMemo(() => {
    const total = list.length
    const actives = list.filter((s) => s.SCHOLARSHIP_STATUS === 'active').length
    const pending = list.filter(
      (s) => s.SCHOLARSHIP_STATUS === 'pending'
    ).length
    const completed = list.filter(
      (s) =>
        s.SCHOLARSHIP_STATUS === 'completed' ||
        s.SCHOLARSHIP_STATUS === 'graduated'
    ).length

    return { total, actives, pending, completed }
  }, [list])

  const columns: ColumnsType<Student> = [
    {
      dataIndex: 'NAME',
      key: 'NAME',
      title: 'Becario',
      render: (_, record) => (
        <CustomSpace direction="vertical" size={0}>
          <CustomText strong>
            {record.NAME} {record.LAST_NAME}
          </CustomText>
          <CustomText type="secondary">
            {formatter({ value: record.IDENTITY_DOCUMENT, format: 'document' })}
          </CustomText>
        </CustomSpace>
      ),
    },
    {
      dataIndex: 'UNIVERSITY',
      key: 'UNIVERSITY',
      title: 'Institución',
      render: (_, record) => (
        <CustomSpace direction="vertical" size={0}>
          <span>{record.UNIVERSITY}</span>
          <CustomText type="secondary">{record.CAREER}</CustomText>
        </CustomSpace>
      ),
    },
    {
      dataIndex: 'ACADEMIC_AVERAGE',
      key: 'ACADEMIC_AVERAGE',
      title: 'Índice',
      align: 'center',
    },
    {
      dataIndex: 'HOURS_COMPLETED',
      key: 'HOURS_COMPLETED',
      title: 'Horas Servicio',
      render: (_, record) =>
        `${record.HOURS_COMPLETED}/${record.HOURS_REQUIRED}`,
    },
    {
      dataIndex: 'SCHOLARSHIP_STATUS',
      key: 'STATE',
      title: 'Estado',
      render: (value) => (
        <CustomTag color={statusConfig[value]?.color}>
          {statusConfig[value]?.label ?? value}
        </CustomTag>
      ),
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      title: 'Acciones',
      align: 'center',
      width: '5%',
      render: (_, record) => (
        <CustomSpace
          direction={'horizontal'}
          split={<CustomDivider type={'vertical'} size={'small'} />}
        >
          <CustomTooltip title={'Expediente'}>
            <CustomButton
              type="link"
              icon={<EyeOutlined />}
              onClick={() => openDrawer(record)}
            />
          </CustomTooltip>
          <CustomTooltip title={'Seguimiento'}>
            <CustomButton
              type="link"
              icon={<CalendarOutlined />}
              onClick={() => openDrawer(record)}
            />
          </CustomTooltip>
        </CustomSpace>
      ),
    },
  ]

  return (
    <>
      <CustomSpin spinning={isPending}>
        <CustomRow gutter={[16, 16]}>
          <CustomCol xs={24} lg={6}>
            <CustomCard>
              <CustomStatistic
                title="Becarios activos"
                value={summary.actives}
              />
            </CustomCard>
          </CustomCol>
          <CustomCol xs={24} lg={6}>
            <CustomCard>
              <CustomStatistic title="Pendientes" value={summary.pending} />
            </CustomCard>
          </CustomCol>
          <CustomCol xs={24} lg={6}>
            <CustomCard>
              <CustomStatistic
                title="Completadas/Graduados"
                value={summary.completed}
              />
            </CustomCard>
          </CustomCol>
          <CustomCol xs={24} lg={6}>
            <CustomCard>
              <CustomStatistic title="Total inscritos" value={summary.total} />
            </CustomCard>
          </CustomCol>
        </CustomRow>
        <CustomDivider />

        <SmartTable
          dataSource={list}
          columns={columns}
          metadata={metadata}
          createText="Agregar becario"
          showActions={false}
          onEdit={() => null}
          onUpdate={() => null}
          onSearch={setSearchKey}
          onChange={(page, size) =>
            setPagination({
              page: page ?? pagination.page,
              size: size ?? pagination.size,
            })
          }
        />
      </CustomSpin>

      <StudentDrawer
        open={drawerOpen}
        student={selected}
        onClose={closeDrawer}
        statusColors={statusConfig}
      />
    </>
  )
}

export default StudentsPage
