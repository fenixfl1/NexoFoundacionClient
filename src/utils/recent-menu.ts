import { getSessionInfo } from 'src/lib/session'
import { MenuOption } from 'src/services/menu-options/menu-options.types'

export type RecentMenuItem = Pick<
  MenuOption,
  'MENU_OPTION_ID' | 'NAME' | 'PATH' | 'ICON'
> & {
  touchedAt: string
}

const RECENT_MENU_KEY = 'recentMenuOptions'
const MAX_RECENT = 6

const getStorageKey = (roleId?: string) =>
  `${RECENT_MENU_KEY}:${roleId || 'unknown'}`

export const getRecentMenuOptions = (roleId?: string): RecentMenuItem[] => {
  const key = getStorageKey(roleId)
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw) as RecentMenuItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const addRecentMenuOption = (option: MenuOption) => {
  if (!option?.MENU_OPTION_ID || !option?.PATH) return

  const { roleId } = getSessionInfo()
  const existing = getRecentMenuOptions(String(roleId))
  const filtered = existing.filter(
    (item) => item.MENU_OPTION_ID !== option.MENU_OPTION_ID
  )

  const next: RecentMenuItem[] = [
    {
      MENU_OPTION_ID: option.MENU_OPTION_ID,
      NAME: option.NAME,
      PATH: option.PATH,
      ICON: option.ICON,
      touchedAt: new Date().toISOString(),
    },
    ...filtered,
  ].slice(0, MAX_RECENT)

  localStorage.setItem(getStorageKey(String(roleId)), JSON.stringify(next))
}
