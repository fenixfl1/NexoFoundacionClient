import React, { useState } from 'react'
import { FormListFieldData, FormListProps } from 'antd/es/form'
import { Form, FormInstance } from 'antd'
import { useErrorHandler } from 'src/hooks/use-error-handler'
import { StoreValue } from 'antd/lib/form/interface'
import { CloseOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import CustomButton from './CustomButton'
import CustomCol from './CustomCol'
import CustomCollapse from './CustomCollapse'
import CustomFormList from './CustomFormList'
import CustomRow from './CustomRow'
import CustomTooltip from './CustomTooltip'
import ConditionalComponent from '../ConditionalComponent'
import styled from 'styled-components'
import CustomCard from './CustomCard'
import { CustomText } from './CustomParagraph'
import { colors } from 'src/constants/colors'

const Container = styled(CustomCard)`
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
`

type RenderCollapseItem = (
  field: FormListFieldData,
  index: number
) => React.ReactNode

type Index = number | number[]

export type RemoveFn = (index: number | number[]) => void

interface CustomCollapseFormListaProps extends Omit<FormListProps, 'children'> {
  accordion?: boolean
  beforeAdd?: () => boolean | Promise<boolean>
  addText?: string
  children: RenderCollapseItem
  form: FormInstance
  itemLabel?: (index: number) => string
  onAdd?: (
    add: (defaultValue?: StoreValue, insertIndex?: number) => void,
    index: number
  ) => void
  onRemove?: (index: number | number[], remove: RemoveFn) => void
  sort?: 'ASC' | 'DESC' | 'asc' | 'desc'
  removeIcon?: ((index: number) => React.ReactNode) | React.ReactNode
  activateIcon?: React.ReactNode
  removeTooltip?: string
  activateTooltip?: string
  size?: SizeType
  addButtonPosition?: 'top-right' | 'bottom'
  disabled?: boolean | ((index: Index) => boolean)
}

const CustomCollapseFormList: React.FC<CustomCollapseFormListaProps> = ({
  accordion = true,
  addButtonPosition = 'top-right',
  addText = 'Agregar',
  beforeAdd,
  children,
  form,
  itemLabel,
  name,
  onAdd,
  onRemove,
  sort = 'ASC',
  removeIcon = <CloseOutlined />,
  activateIcon = <StopOutlined style={{ color: colors.disabled }} />,
  removeTooltip = 'Remover',
  activateTooltip = 'Habilitar',
  size = 'small',
  disabled = false,
  ...props
}) => {
  const [errorHandler] = useErrorHandler()
  const fieldList = Form.useWatch(name, form)
  const [activeKey, setActiveKey] = useState<string[]>(['0'])

  const handleAdd = async (
    add: (defaultValue?: StoreValue, insertIndex?: number) => void
  ) => {
    try {
      if (beforeAdd) {
        const shouldAdd = await beforeAdd()

        if (shouldAdd === false) {
          return
        }
      }

      const nextIndex = fieldList?.length
      if (onAdd) {
        onAdd(add, nextIndex)
      } else {
        add()
      }
      setActiveKey([`${nextIndex}`])
    } catch (error) {
      errorHandler(error)
    }
  }

  const AddButton: React.FC<{
    add: (defaultValue?: StoreValue, insertIndex?: number) => void
  }> = ({ add }) => (
    <CustomButton
      icon={<PlusOutlined />}
      block={addButtonPosition === 'bottom'}
      type={addButtonPosition === 'bottom' ? 'dashed' : 'primary'}
      onClick={() => handleAdd(add)}
    >
      {addText}
    </CustomButton>
  )

  return (
    <CustomFormList name={name} {...props}>
      {(fields, { add, remove }) => (
        <CustomRow gap={10} justify={'end'}>
          <ConditionalComponent condition={addButtonPosition === 'top-right'}>
            <AddButton add={add} />
          </ConditionalComponent>

          <ConditionalComponent condition={!!fields?.length}>
            <Container>
              <CustomCol xs={24}>
                <CustomCollapse
                  size={size}
                  accordion={accordion}
                  activeKey={activeKey}
                  onChange={setActiveKey}
                  expandIconPosition={'left'}
                  items={fields
                    .sort((a, b) =>
                      sort.toLowerCase() === 'desc'
                        ? a.name - b.name
                        : b.name - a.name
                    )
                    .map((field, index) => {
                      const isDisabled =
                        typeof disabled === 'function'
                          ? disabled?.(field.name)
                          : disabled
                      return {
                        label: (
                          <CustomText delete={isDisabled} disabled={isDisabled}>
                            {itemLabel?.(field.name) ?? ''}
                          </CustomText>
                        ),
                        key: String(field.name),
                        children: children(field, index),
                        extra: (
                          <CustomTooltip
                            title={isDisabled ? activateTooltip : removeTooltip}
                          >
                            <CustomButton
                              danger
                              icon={
                                isDisabled
                                  ? activateIcon
                                  : typeof removeIcon === 'function'
                                  ? removeIcon(field.name)
                                  : removeIcon
                              }
                              type={'text'}
                              onClick={(event) => {
                                event.stopPropagation()

                                if (typeof onRemove === 'function') {
                                  onRemove?.(field.name, remove)
                                } else {
                                  remove(field.name)
                                }
                              }}
                            />
                          </CustomTooltip>
                        ),
                      }
                    })}
                />
              </CustomCol>
            </Container>
          </ConditionalComponent>

          <ConditionalComponent condition={addButtonPosition === 'bottom'}>
            <AddButton add={add} />
          </ConditionalComponent>
        </CustomRow>
      )}
    </CustomFormList>
  )
}

export default CustomCollapseFormList
