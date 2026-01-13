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

  const { documents, metadata } = useStudentDocumentStore()
  const { mutate: getDocuments, isPending } =
    useGetStudentDocumentPaginationMutation()
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
            : data.FILE_NAME ?? 'documento.pdf'
        link.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        errorHandler(error)
      }
    },
    [errorHandler, notify]
  )

  const columns: ColumnsType<StudentDocument> = useMemo(
    () => [
      {
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
      },
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
        dataIndex: 'UNIVERSITY',
        key: 'UNIVERSITY',
        title: 'Institución',
        render: (_, record) => (
          <CustomSpace direction="vertical" size={0}>
            <CustomText>{record.UNIVERSITY}</CustomText>
            <CustomText type="secondary">{record.CAREER}</CustomText>
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
    ],
    []
  )

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
      <SmartTable
        form={form}
        rowKey="DOCUMENT_ID"
        loading={isPending || isUpdatePending}
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
        onEdit={(record) => {
          setEditing(record)
          setModalOpen(true)
        }}
        onUpdate={handleToggleState}
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
