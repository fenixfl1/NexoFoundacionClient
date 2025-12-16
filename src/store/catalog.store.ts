import { Catalog, MultiCatalog } from 'src/services/catalog/catalog.types'
import { Metadata, ReturnPayload } from 'src/types/general'
import { create } from 'zustand'

const metadata: Metadata = {
  count: 0,
  currentPage: 1,
  pageSize: 15,
  totalPages: 1,
  totalRows: 0,
  links: undefined,
}

interface UseCatalogStore {
  catalogList: Catalog[]
  multiCatalogList: MultiCatalog
  catalog: Catalog
  metadata: Metadata
  setMultiCatalogList: (payload: MultiCatalog) => void
  setCatalogList: (payload: ReturnPayload<Catalog>) => void
  setCatalog: (catalog: Catalog) => void
}

export const useCatalogStore = create<UseCatalogStore>((set) => ({
  catalogList: [],
  catalog: <Catalog>{},
  multiCatalogList: <MultiCatalog>{},
  metadata,
  setMultiCatalogList: (multiCatalogList) => set({ multiCatalogList }),
  setCatalog: (catalog) => set({ catalog }),
  setCatalogList: ({ data, metadata }) =>
    set({ catalogList: data, metadata: metadata.pagination }),
}))
