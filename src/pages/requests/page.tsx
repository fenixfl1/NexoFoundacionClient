import React, { useEffect, useMemo, useState } from 'react'
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
import CustomTooltip from 'src/components/custom/CustomTooltip'
import { ColumnsType } from 'antd/lib/table'
import { RequestItem } from 'src/services/requests/request.types'
import { useRequestStore } from 'src/store/requests.store'
import { CustomText } from 'src/components/custom/CustomParagraph'
import { EyeOutlined } from '@ant-design/icons'
import RequestForm from './components/RequestForm'
import formatter from 'src/utils/formatter'
import { useGetRequestPaginationMutation } from 'src/services/requests/useGetRequestPaginationMutation'
import { AdvancedCondition } from 'src/types/general'

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: 'Nueva', color: 'blue' },
  in_review: { label: 'En revisión', color: 'gold' },
  approved: { label: 'Aprobada', color: 'green' },
  rejected: { label: 'Rechazada', color: 'red' },
  scheduled: { label: 'Cita programada', color: 'purple' },
}

const RequestsPage: React.FC = () => {
  const [searchKey, setSearchKey] = useState('')
  const [pagination, setPagination] = useState({ page: 1, size: 10 })
  const { list, metadata, selected, drawerOpen, openDrawer, closeDrawer } =
    useRequestStore()
  const { mutate: getRequests, isPending } = useGetRequestPaginationMutation()

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

    getRequests({
      page: pagination.page,
      size: pagination.size,
      condition,
    })
  }, [getRequests, pagination.page, pagination.size, searchKey])

  const summary = useMemo(() => {
    const total = list.length
    const newOnes = list.filter((r) => r.STATUS === 'new').length
    const inReview = list.filter((r) => r.STATUS === 'in_review').length
    const scheduled = list.filter((r) => r.STATUS === 'scheduled').length

    return { total, newOnes, inReview, scheduled }
  }, [list])

  const columns: ColumnsType<RequestItem> = [
    {
      dataIndex: 'STUDENT_NAME',
      key: 'student',
      title: 'Becario',
      render: (_, record) => (
        <CustomSpace direction="vertical" size={0}>
          <CustomText strong>
            {record.STUDENT_NAME} {record.STUDENT_LAST_NAME}
          </CustomText>
          <CustomText type="secondary">
            {formatter({
              value: record.IDENTITY_DOCUMENT,
              format: 'document',
            })}
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
      dataIndex: 'REQUEST_TYPE',
      key: 'type',
      title: 'Tipo',
      render: (value) => <CustomTag>{value}</CustomTag>,
    },
    {
      dataIndex: 'STATUS',
      key: 'status',
      title: 'Estado',
      render: (value) => (
        <CustomTag color={statusConfig[value]?.color}>
          {statusConfig[value]?.label ?? value}
        </CustomTag>
      ),
    },
    {
      dataIndex: 'NEXT_APPOINTMENT',
      key: 'NEXT_APPOINTMENT',
      title: 'Cita programada',
      render: (value) =>
        value ? formatter({ value, format: 'date' }) : 'No programada',
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      title: 'Acciones',
      align: 'center',
      render: (_, record) => (
        <CustomTooltip title="Ver detalle">
          <CustomButton
            type="link"
            icon={<EyeOutlined />}
            onClick={() => openDrawer(record)}
          />
        </CustomTooltip>
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
                title="Solicitudes nuevas"
                value={summary.newOnes}
              />
            </CustomCard>
          </CustomCol>
          <CustomCol xs={24} lg={6}>
            <CustomCard>
              <CustomStatistic title="En revisión" value={summary.inReview} />
            </CustomCard>
          </CustomCol>
          <CustomCol xs={24} lg={6}>
            <CustomCard>
              <CustomStatistic
                title="Citas programadas"
                value={summary.scheduled}
              />
            </CustomCard>
          </CustomCol>
          <CustomCol xs={24} lg={6}>
            <CustomCard>
              <CustomStatistic title="Total" value={summary.total} />
            </CustomCard>
          </CustomCol>
        </CustomRow>
        <CustomDivider />

        <SmartTable
          dataSource={list}
          columns={columns}
          metadata={metadata}
          createText="Registrar solicitud"
          showActions={false}
          onCreate={() => openDrawer(undefined)}
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

      <RequestForm
        open={drawerOpen}
        request={selected}
        onClose={closeDrawer}
        statusColors={statusConfig}
      />
    </>
  )
}

export default RequestsPage
