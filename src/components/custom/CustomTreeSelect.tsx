import React from 'react'
import { TreeSelect, TreeSelectProps } from 'antd'
import { useFormContext } from 'src/context/FormContext'
import { useFormItemContext } from 'src/context/FormItemContext'

const CustomTreeSelect: React.FC<TreeSelectProps> = ({
  treeDefaultExpandAll = true,
  showSearch = true,
  allowClear = true,
  ...props
}) => {
  const formContext = useFormContext()
  const formItemContext = useFormItemContext()

  return (
    <TreeSelect
      treeDefaultExpandAll={treeDefaultExpandAll}
      showSearch={showSearch}
      allowClear={allowClear}
      disabled={formItemContext?.readonly ?? formContext?.readonly}
      {...props}
    />
  )
}

export default CustomTreeSelect
