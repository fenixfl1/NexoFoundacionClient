export interface Catalog {
  CATALOG_ID: number
  NAME: string
  DESCRIPTION: string
  KEY: string
  STATE: string
  ITEMS: CatalogItem[]
}

export interface CatalogItem {
  ITEM_ID: number
  CATALOG_ID: number
  VALUE: string
  LABEL: string
  ORDER: number
  STATE: string
  EXTRA: Record<string, unknown>
}

export interface MultiCatalog {
  [key: string]: Pick<CatalogItem, 'ITEM_ID' | 'EXTRA' | 'LABEL' | 'VALUE'>[]
}
