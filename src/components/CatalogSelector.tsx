import React, { useMemo } from 'react'
import CustomSelect, { CustomSelectProps } from './custom/CustomSelect'
import { useGetCatalog } from 'src/hooks/use-get-catalog'
import { CatalogItem } from 'src/services/catalog/catalog.types'

interface CatalogSelectorProps extends Omit<CustomSelectProps, 'options'> {
  catalog: string
  filter?: (
    option: Pick<CatalogItem, 'ITEM_ID' | 'EXTRA' | 'LABEL' | 'VALUE'>
  ) => boolean
}

const CatalogSelector: React.FC<CatalogSelectorProps> = ({
  catalog,
  filter = Boolean,
  placeholder = 'Seleccionar',
  allowClear = true,
  ...props
}) => {
  const [options] = useGetCatalog(catalog)

  const catalogOptions = useMemo(() => {
    if (!options) return []

    return options
      .filter(filter)
      .map((item) => ({ label: item.LABEL, value: item.VALUE }))
  }, [options, filter])

  return (
    <CustomSelect
      allowClear={allowClear}
      placeholder={placeholder}
      options={catalogOptions}
      {...props}
    />
  )
}

export default CatalogSelector
