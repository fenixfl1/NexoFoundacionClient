import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Form } from 'antd'
import { DownloadOutlined, FileDoneOutlined } from '@ant-design/icons'
import SmartTable from 'src/components/SmartTable'
import CustomRow from 'src/components/custom/CustomRow'
import CustomCol from 'src/components/custom/CustomCol'
import CustomFormItem from 'src/components/custom/CustomFormItem'
import CustomInput from 'src/components/custom/CustomInput'
import CustomSpace from 'src/components/custom/CustomSpace'
import { CustomText } from 'src/components/custom/CustomParagraph'
import CustomTooltip from 'src/components/custom/CustomTooltip'
import CustomButton from 'src/components/custom/CustomButton'
import CustomAlert from 'src/components/custom/CustomAlert'
import StateSelector from 'src/components/StateSelector'
import ConditionalComponent from 'src/components/ConditionalComponent'
import { ColumnsType } from 'antd/lib/table'
import { defaultBreakpoints } from 'src/config/breakpoints'
import { useStudentDocumentStore } from 'src/store/student-document.store'
import { StudentDocument } from 'src/services/student-documents/student-document.types'
import { useGetStudentDocumentPaginationMutation } from 'src/services/student-documents/useGetStudentDocumentPaginationMutation'
import { useUpdateStudentDocumentMutation } from 'src/services/student-documents/useUpdateStudentDocumentMutation'
import { useCustomModal } from 'src/hooks/use-custom-modal'
import { useErrorHandler } from 'src/hooks/use-error-handler'
import useDebounce from 'src/hooks/use-debounce'
import { AdvancedCondition } from 'src/types/general'
import { getConditionFromForm } from 'src/utils/get-condition-from'
import formatter from 'src/utils/formatter'
import StudentDocumentForm from './components/StudentDocumentForm'
import { getRequest } from 'src/services/api'
import { API_PATH_GET_STUDENT_DOCUMENT } from 'src/constants/routes'
import { base64ToBlob } from 'src/utils/base64-helpers'
import { useAppNotification } from 'src/context/NotificationContext'
import { getSessionInfo } from 'src/lib/session'
import { ROLE_STUDENT_ID } from 'src/utils/role-path'
import { useRequirementStore } from 'src/store/requirement.store'
import { useGetRequirementPaginationMutation } from 'src/services/requirements/useGetRequirementPaginationMutation'
import CustomDivider from 'src/components/custom/CustomDivider'

const initialFilter = {
  FILTER: {
    STATE__IN: ['A'],
  },
}

const Page: React.FC = () => {
  const [form] = Form.useForm()
  const [searchKey, setSearchKey] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<StudentDocument>()
  const debounce = useDebounce(searchKey)
  const notify = useAppNotification()
  const { confirmModal } = useCustomModal()
  const [errorHandler] = useErrorHandler()
  const { roleId } = getSessionInfo()
  const isStudentRole = String(roleId) === ROLE_STUDENT_ID

  const { documents, metadata } = useStudentDocumentStore()
  const { requirements } = useRequirementStore()
  const { mutate: getDocuments, isPending } =
    useGetStudentDocumentPaginationMutation()
  const { mutate: getRequirements, isPending: isRequirementsPending } =
    useGetRequirementPaginationMutation()
  const { mutateAsync: updateDocument, isPending: isUpdatePending } =
    useUpdateStudentDocumentMutation()

  const handleSearch = useCallback(
    (page = metadata.currentPage, size = metadata.pageSize) => {
      const { FILTER = initialFilter.FILTER } = form.getFieldsValue()
      const condition: AdvancedCondition[] = getConditionFromForm(FILTER)

      if (debounce) {
        condition.push({
          value: debounce,
          operator: 'LIKE',
          field: [
            'NAME',
            'LAST_NAME',
            'IDENTITY_DOCUMENT',
            'DOCUMENT_TYPE',
            'FILE_NAME',
          ],
        })
      }

      getDocuments({ page, size, condition })
    },
    [debounce, form, metadata.currentPage, metadata.pageSize, getDocuments]
  )

  useEffect(handleSearch, [handleSearch])

  useEffect(() => {
    if (!isStudentRole) return
    const condition: AdvancedCondition[] = [
      { field: 'STATE', operator: '=', value: 'A' },
    ]
    getRequirements({ page: 1, size: 200, condition })
  }, [getRequirements, isStudentRole])

  const handleToggleState = (record: StudentDocument) => {
    confirmModal({
      title: 'Confirmación',
      content: `¿Deseas ${
        record.STATE === 'A' ? 'desactivar' : 'activar'
      } el documento?`,
      onOk: async () => {
        try {
          await updateDocument({
            DOCUMENT_ID: record.DOCUMENT_ID,
            STATE: record.STATE === 'A' ? 'I' : 'A',
          } as StudentDocument)
          handleSearch()
        } catch (error) {
          errorHandler(error)
        }
      },
    })
  }

  const handleDownload = useCallback(
    async (record: StudentDocument, type: 'original' | 'signed') => {
      try {
        const {
          data: { data },
        } = await getRequest<StudentDocument>(
          `${API_PATH_GET_STUDENT_DOCUMENT}/`,
          record.DOCUMENT_ID
        )

        const base64 =
          type === 'signed' ? data?.SIGNED_BASE64 : data?.FILE_BASE64

        if (!base64) {
          notify(
            {
              message: 'Documento no disponible',
              description:
                type === 'signed'
                  ? 'No hay un archivo firmado para este documento.'
                  : 'El archivo no está disponible.',
            },
            'warning'
          )
          return
        }

        const blob = base64ToBlob(base64)
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download =
          type === 'signed'
            ? `firmado-${data.FILE_NAME ?? 'documento.pdf'}`
            : (data.FILE_NAME ?? 'documento.pdf')
        link.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        errorHandler(error)
      }
    },
    [errorHandler, notify]
  )

  const columns: ColumnsType<StudentDocument> = useMemo(() => {
    const baseColumns: ColumnsType<StudentDocument> = [
      {
        dataIndex: 'DOCUMENT_TYPE',
        key: 'DOCUMENT_TYPE',
        title: 'Documento',
        render: (_, record) => (
          <CustomSpace direction="vertical" size={0}>
            <CustomText strong>{record.DOCUMENT_TYPE}</CustomText>
            <CustomText type="secondary">{record.FILE_NAME}</CustomText>
          </CustomSpace>
        ),
      },
      {
        dataIndex: 'SIGNED_AT',
        key: 'SIGNED_AT',
        title: 'Firmado',
        render: (value) =>
          value ? formatter({ value, format: 'datetime' }) : 'Sin firma',
      },
      {
        dataIndex: 'CREATED_AT',
        key: 'CREATED_AT',
        title: 'Registro',
        render: (value) => formatter({ value, format: 'datetime' }),
      },
    ]

    if (!isStudentRole) {
      baseColumns.unshift({
        dataIndex: 'STUDENT',
        key: 'STUDENT',
        title: 'Becario',
        render: (_, record) => (
          <CustomSpace direction="vertical" size={0}>
            <CustomText
              strong
            >{`${record.NAME} ${record.LAST_NAME}`}</CustomText>
            <CustomText type="secondary">
              {formatter({
                value: record.IDENTITY_DOCUMENT,
                format: 'document',
              })}
            </CustomText>
          </CustomSpace>
        ),
      })

      baseColumns.splice(2, 0, {
        dataIndex: 'UNIVERSITY',
        key: 'UNIVERSITY',
        title: 'Institución',
        render: (_, record) => (
          <CustomSpace direction="vertical" size={0}>
            <CustomText>{record.UNIVERSITY}</CustomText>
            <CustomText type="secondary">{record.CAREER}</CustomText>
          </CustomSpace>
        ),
      })
    }

    return baseColumns
  }, [isStudentRole])

  const missingRequirements = useMemo(() => {
    if (!isStudentRole) return []
    const docTypes = new Set(
      documents.map((doc) => (doc.DOCUMENT_TYPE || '').toLowerCase())
    )

    return requirements
      .filter((req) => req.STATE === 'A' && req.IS_REQUIRED)
      .filter((req) => {
        const key = (req.REQUIREMENT_KEY || '').toLowerCase()
        const name = (req.NAME || '').toLowerCase()
        return key && !docTypes.has(key) && !docTypes.has(name)
      })
      .map((req) => req.NAME || req.REQUIREMENT_KEY)
  }, [documents, requirements, isStudentRole])

  const filter = (
    <CustomRow gutter={[8, 8]}>
      <CustomCol xs={24}>
        <CustomFormItem
          label={'Estado'}
          name={['FILTER', 'STATE__IN']}
          labelCol={{ span: 24 }}
        >
          <StateSelector />
        </CustomFormItem>
      </CustomCol>
      <CustomCol {...defaultBreakpoints}>
        <CustomFormItem
          label={'Tipo de documento'}
          name={['FILTER', 'DOCUMENT_TYPE__LIKE']}
          labelCol={{ span: 24 }}
        >
          <CustomInput placeholder="Ej: Carta de aceptación" />
        </CustomFormItem>
      </CustomCol>
    </CustomRow>
  )

  return (
    <>
      <ConditionalComponent condition={isStudentRole}>
        <div>
          <CustomAlert
            type={missingRequirements.length ? 'warning' : 'success'}
            showIcon
            message={
              missingRequirements.length
                ? `Documentos pendientes: ${missingRequirements.join(', ')}`
                : 'No tienes documentos pendientes.'
            }
          />
          <CustomDivider />
        </div>
      </ConditionalComponent>
      <SmartTable
        form={form}
        rowKey="DOCUMENT_ID"
        loading={isPending || isUpdatePending || isRequirementsPending}
        columns={columns}
        dataSource={documents}
        metadata={metadata}
        createText={'Nuevo documento'}
        searchPlaceholder={'Buscar documentos...'}
        onCreate={() => {
          setEditing(undefined)
          setModalOpen(true)
        }}
        onChange={handleSearch}
        onSearch={setSearchKey}
        onEdit={
          isStudentRole
            ? undefined
            : (record) => {
                setEditing(record)
                setModalOpen(true)
              }
        }
        onUpdate={isStudentRole ? undefined : handleToggleState}
        filter={filter}
        initialFilter={initialFilter}
        extra={(_, record) => (
          <>
            <CustomTooltip title="Descargar">
              <CustomButton
                type="link"
                icon={<DownloadOutlined />}
                onClick={() =>
                  handleDownload(record as StudentDocument, 'original')
                }
              />
            </CustomTooltip>
            <CustomTooltip title="Descargar firmado">
              <CustomButton
                type="link"
                icon={<FileDoneOutlined />}
                disabled={!(record as StudentDocument).SIGNED_AT}
                onClick={() =>
                  handleDownload(record as StudentDocument, 'signed')
                }
              />
            </CustomTooltip>
          </>
        )}
      />

      <ConditionalComponent condition={modalOpen}>
        <StudentDocumentForm
          open={modalOpen}
          document={editing}
          onClose={() => {
            setModalOpen(false)
            setEditing(undefined)
          }}
          onSuccess={() => {
            handleSearch()
            setEditing(undefined)
          }}
        />
      </ConditionalComponent>
    </>
  )
}

export default Page
