import React from 'react'
import styled from 'styled-components'
import CustomDrawer from 'src/components/custom/CustomDrawer'
import CustomRow from 'src/components/custom/CustomRow'
import CustomCol from 'src/components/custom/CustomCol'
import CustomAvatar from 'src/components/custom/CustomAvatar'
import CustomCollapse from 'src/components/custom/CustomCollapse'
import CustomTag from 'src/components/custom/CustomTag'
import CustomTable from 'src/components/custom/CustomTable'
import { ColumnsType } from 'antd/lib/table'
import { CustomText, CustomTitle } from 'src/components/custom/CustomParagraph'
import { Student } from 'src/services/students/student.types'
import dayjs from 'dayjs'
import formatter from 'src/utils/formatter'

const HeaderCard = styled.div`
  background: ${({ theme }) =>
    theme.isDark ? theme.colorBgElevated : theme.colorBgContainer};
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius}px;
`

const SectionTitle = styled(CustomTitle)`
  margin-bottom: 0 !important;
`

interface StudentDrawerProps {
  open: boolean
  student?: Student
  onClose: () => void
  statusColors: Record<
    string,
    {
      label: string
      color: string
    }
  >
}

const StudentDrawer: React.FC<StudentDrawerProps> = ({
  open,
  student,
  onClose,
  statusColors,
}) => {
  if (!student) {
    return (
      <CustomDrawer open={open} onClose={onClose} width={'48%'}>
        <CustomText type="secondary">
          Selecciona un becario para visualizar su expediente.
        </CustomText>
      </CustomDrawer>
    )
  }

  const initials = `${student.NAME.charAt(0)}${student.LAST_NAME.charAt(0)}`
  const status = statusColors[student.SCHOLARSHIP_STATUS] ?? {
    label: student.SCHOLARSHIP_STATUS,
    color: 'blue',
  }

  const infoItems = [
    {
      key: 'registered',
      label: 'Fecha de registro',
      value: dayjs(student.LAST_FOLLOW_UP ?? new Date()).format(
        'dddd D [de] MMMM [del] YYYY'
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      value: <CustomTag color={status.color}>{status.label}</CustomTag>,
    },
    {
      key: 'code',
      label: 'Código',
      value: student.STUDENT_ID,
    },
    {
      key: 'document',
      label: 'Doc. Identidad',
      value: formatter({
        value: student.IDENTITY_DOCUMENT,
        format: 'document',
      }),
    },
    {
      key: 'university',
      label: 'Universidad',
      value: student.UNIVERSITY,
    },
    {
      key: 'career',
      label: 'Programa académico',
      value: student.CAREER,
    },
    {
      key: 'average',
      label: 'Índice',
      value: student.ACADEMIC_AVERAGE?.toFixed?.(2),
    },
    {
      key: 'cohort',
      label: 'Cohorte',
      value: student.COHORT ?? 'N/A',
    },
    {
      key: 'campus',
      label: 'Campus',
      value: student.CAMPUS ?? 'N/A',
    },
    {
      key: 'hours',
      label: 'Horas de servicio',
      value: `${student.HOURS_COMPLETED}/${student.HOURS_REQUIRED}`,
    },
    {
      key: 'next',
      label: 'Próxima cita',
      value: student.NEXT_APPOINTMENT
        ? dayjs(student.NEXT_APPOINTMENT).format('DD MMM YYYY')
        : 'No programada',
    },
  ]

  const contactColumns: ColumnsType<{
    type: string
    value: string
    primary: boolean
  }> = [
    {
      dataIndex: 'type',
      key: 'type',
      title: 'Tipo',
      width: '20%',
    },
    {
      dataIndex: 'value',
      key: 'value',
      title: 'Valor',
    },
    {
      dataIndex: 'primary',
      key: 'primary',
      title: 'Principal',
      width: '20%',
      align: 'center',
      render: (value) => (value ? '✓' : ''),
    },
  ]

  const contacts = [
    {
      key: 'email',
      type: 'EMAIL',
      value: student.CONTACT_EMAIL,
      primary: true,
    },
    {
      key: 'phone',
      type: 'PHONE',
      value: formatter({
        value: student.CONTACT_PHONE,
        format: 'phone',
      }),
      primary: false,
    },
  ]

  return (
    <CustomDrawer
      title={'Expediente del becario'}
      open={open}
      onClose={onClose}
      width={'48%'}
    >
      <CustomRow justify={'start'}>
        <CustomCol xs={24}>
          <HeaderCard>
            <CustomRow align="middle" gap={20} justify={'center'}>
              <CustomCol xs={24}>
                <CustomRow justify={'center'} width={'100%'}>
                  <CustomAvatar size={96}>{initials}</CustomAvatar>
                </CustomRow>
              </CustomCol>
              <CustomCol style={{ textAlign: 'center' }}>
                <CustomTitle level={3} style={{ margin: 0 }}>
                  {student.NAME} {student.LAST_NAME}
                </CustomTitle>
                <CustomText type="secondary">{student.CAREER}</CustomText>
                <div style={{ marginTop: 10 }}>
                  <CustomTag color={status.color}>{status.label}</CustomTag>
                </div>
              </CustomCol>
            </CustomRow>
          </HeaderCard>
        </CustomCol>
      </CustomRow>

      <CustomCollapse
        style={{ marginTop: 15 }}
        defaultActiveKey={[1, 2]}
        items={[
          {
            key: 1,
            label: <SectionTitle level={4}>Información personal</SectionTitle>,
            children: (
              <CustomRow gutter={[16, 16]}>
                {infoItems.map((item) => (
                  <CustomCol xs={24} md={12} key={item.key}>
                    <CustomText type="secondary">{item.label}</CustomText>
                    <div>{item.value || 'N/A'}</div>
                  </CustomCol>
                ))}
              </CustomRow>
            ),
          },
          {
            key: 2,
            label: <SectionTitle level={4}>Contactos</SectionTitle>,
            children: (
              <CustomTable
                columns={contactColumns}
                dataSource={contacts}
                pagination={false}
                rowKey="key"
              />
            ),
          },
        ]}
      />
    </CustomDrawer>
  )
}

export default StudentDrawer
