import { useCallback, useEffect } from 'react'
import { useGetMultiCatalogListMutation } from 'src/services/catalog/useGetMultiCatalogListMutation'
import { useParameterStore } from 'src/store/parameter.store'

export function useGetMultiCatalogList() {
  const { activityParameter } = useParameterStore()

  const { mutate: getMultiList } = useGetMultiCatalogListMutation()

  const handleSearch = useCallback(() => {
    const payload: Record<string, string | number> = {}
    Object.entries(activityParameter).forEach(([key, value]) => {
      if (key.includes('ID_LIST')) {
        payload[key] = value
      }
    })

    getMultiList(payload)
  }, [activityParameter])

  useEffect(handleSearch, [handleSearch])
}
