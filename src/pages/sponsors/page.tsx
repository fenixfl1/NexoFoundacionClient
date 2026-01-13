import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Form } from 'antd'
import SmartTable from 'src/components/SmartTable'
import CustomRow from 'src/components/custom/CustomRow'
import CustomCol from 'src/components/custom/CustomCol'
import CustomFormItem from 'src/components/custom/CustomFormItem'
import CustomSelect from 'src/components/custom/CustomSelect'
import CustomTag from 'src/components/custom/CustomTag'
import CustomSpace from 'src/components/custom/CustomSpace'
import CustomDivider from 'src/components/custom/CustomDivider'
import StateSelector from 'src/components/StateSelector'
import ConditionalComponent from 'src/components/ConditionalComponent'
import { ColumnsType } from 'antd/lib/table'
import { useSponsorStore } from 'src/store/sponsor.store'
import { Sponsor } from 'src/services/sponsors/sponsor.types'
import { useGetSponsorPaginationMutation } from 'src/services/sponsors/useGetSponsorPaginationMutation'
import { useUpdateSponsorMutation } from 'src/services/sponsors/useUpdateSponsorMutation'
import { useCustomModal } from 'src/hooks/use-custom-modal'
import { useErrorHandler } from 'src/hooks/use-error-handler'
import useDebounce from 'src/hooks/use-debounce'
import { AdvancedCondition } from 'src/types/general'
import { getConditionFromForm } from 'src/utils/get-condition-from'
import { CustomText } from 'src/components/custom/CustomParagraph'
import SponsorForm from './components/SponsorForm'

const sponsorInitialFilter = {
  FILTER: {
    STATE__IN: ['A'],
  },
}

const sponsorTypeOptions = [
  { label: 'Empresa', value: 'company' },
  { label: 'Persona', value: 'person' },
  { label: 'Fundación', value: 'foundation' },
  { label: 'ONG', value: 'ngo' },
  { label: 'Otro', value: 'other' },
]

const SponsorsPage: React.FC = () => {
  const [form] = Form.useForm()
  const [searchKey, setSearchKey] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Sponsor>()
  const debounce = useDebounce(searchKey)
  const { confirmModal } = useCustomModal()
  const [errorHandler] = useErrorHandler()

  const { sponsors, metadata } = useSponsorStore()
  const { mutate: getSponsors, isPending } =
    useGetSponsorPaginationMutation()
  const { mutateAsync: updateSponsor, isPending: isUpdatePending } =
    useUpdateSponsorMutation()

  const handleSearch = useCallback(
    (page = metadata.currentPage, size = metadata.pageSize) => {
      const { FILTER = sponsorInitialFilter.FILTER } = form.getFieldsValue()
      const condition: AdvancedCondition[] = getConditionFromForm(FILTER)

      if (debounce) {
        condition.push({
          value: debounce,
          operator: 'LIKE',
          field: ['NAME', 'TYPE', 'TAX_ID', 'CONTACT_NAME', 'CONTACT_EMAIL'],
        })
      }

      getSponsors({ page, size, condition })
    },
    [debounce, form, metadata.currentPage, metadata.pageSize, getSponsors]
  )

  useEffect(handleSearch, [handleSearch])

  const handleToggleState = (record: Sponsor) => {
    confirmModal({
      title: 'Confirmación',
      content: `¿Deseas ${
        record.STATE === 'A' ? 'desactivar' : 'activar'
      } el patrocinador "${record.NAME}"?`,
      onOk: async () => {
        try {
          await updateSponsor({
            SPONSOR_ID: record.SPONSOR_ID,
            STATE: record.STATE === 'A' ? 'I' : 'A',
          } as Sponsor)
          handleSearch()
        } catch (error) {
          errorHandler(error)
        }
      },
    })
  }

  const columns: ColumnsType<Sponsor> = useMemo(
    () => [
      {
        dataIndex: 'NAME',
        key: 'NAME',
        title: 'Patrocinador',
        render: (_, record) => (
          <CustomSpace direction="vertical" size={0}>
            <CustomText strong>{record.NAME}</CustomText>
            <CustomText type="secondary">{record.TAX_ID}</CustomText>
          </CustomSpace>
        ),
      },
      {
        dataIndex: 'TYPE',
        key: 'TYPE',
        title: 'Tipo',
        render: (value: string) => {
          const option = sponsorTypeOptions.find(
            (item) => item.value === value
          )
          return (
            <CustomTag color="blue">{option?.label ?? value}</CustomTag>
          )
        },
      },
      {
        dataIndex: 'CONTACT_NAME',
        key: 'CONTACT_NAME',
        title: 'Contacto',
        render: (_, record) => (
          <CustomSpace direction="vertical" size={0}>
            <CustomText>{record.CONTACT_NAME ?? '—'}</CustomText>
            <CustomText type="secondary">
              {record.CONTACT_EMAIL ?? ''}
            </CustomText>
          </CustomSpace>
        ),
      },
      {
        dataIndex: 'CONTACT_PHONE',
        key: 'CONTACT_PHONE',
        title: 'Teléfono',
      },
      {
        dataIndex: 'ADDRESS',
        key: 'ADDRESS',
        title: 'Dirección',
        render: (value) => value || '—',
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
      <CustomCol xs={24}>
        <CustomFormItem
          label={'Tipo'}
          name={['FILTER', 'TYPE__IN']}
          labelCol={{ span: 24 }}
        >
          <CustomSelect
            mode="multiple"
            placeholder="Seleccionar tipos"
            allowClear
            options={sponsorTypeOptions}
          />
        </CustomFormItem>
      </CustomCol>
    </CustomRow>
  )

  return (
    <>
      <CustomDivider />
      <SmartTable
        form={form}
        rowKey="SPONSOR_ID"
        loading={isPending || isUpdatePending}
        columns={columns}
        dataSource={sponsors}
        metadata={metadata}
        createText={'Nuevo patrocinador'}
        searchPlaceholder={'Buscar patrocinadores...'}
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
        initialFilter={sponsorInitialFilter}
      />

      <ConditionalComponent condition={modalOpen}>
        <SponsorForm
          open={modalOpen}
          sponsor={editing}
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

export default SponsorsPage
