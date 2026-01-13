import React, { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { useGetUserMenuOptionsQuery } from 'src/services/menu-options/useGetUserMenuOptionsQuery'
import { useMenuOptionStore } from 'src/store/menu-options.store'
import { getCurrentRoleBasePath } from 'src/utils/role-path'
import { findParentKeys } from 'src/utils/find-parent-keys'

const RoleRedirect: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const basePath = getCurrentRoleBasePath()
  const {
    menuOptions,
    setOpenKeys,
    setSelectedKeys,
    setCurrentMenuOption,
  } = useMenuOptionStore()

  useGetUserMenuOptionsQuery()

  useEffect(() => {
    if (!menuOptions.length) return
    const findFirstLeaf = (options: typeof menuOptions) => {
      for (const option of options) {
        if (option?.CHILDREN?.length) {
          const nested = findFirstLeaf(option.CHILDREN)
          if (nested) return nested
        }
        if (option?.PATH) return option
      }
      return undefined
    }

    const first = findFirstLeaf(menuOptions)
    if (!first?.PATH) return

    const toTree = (options: typeof menuOptions) =>
      options.map((option) => ({
        key: option.MENU_OPTION_ID,
        children: option.CHILDREN ? toTree(option.CHILDREN) : [],
      }))

    const menuTree = toTree(menuOptions)

    const parentKeys = findParentKeys(menuTree, [first.MENU_OPTION_ID])
    setOpenKeys(parentKeys.map(String))
    setSelectedKeys([first.MENU_OPTION_ID])
    setCurrentMenuOption(first)

    const target = `${basePath}${first.PATH}`
    if (location.pathname !== target) {
      navigate(target, { replace: true })
    }
  }, [
    menuOptions,
    basePath,
    location.pathname,
    navigate,
    setOpenKeys,
    setSelectedKeys,
    setCurrentMenuOption,
  ])

  return <Navigate to={basePath} replace />
}

export default RoleRedirect
