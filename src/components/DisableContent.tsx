import React from 'react'

type DisableContentProps = {
  disabled?: boolean
  opacity?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

const DisableContent: React.FC<DisableContentProps> = ({
  children,
  disabled = false,
  opacity = '1',
  style,
}) => {
  return (
    <div
      style={
        disabled
          ? { pointerEvents: 'none', opacity, cursor: 'not-allowed', ...style }
          : { ...style }
      }
      onKeyDown={
        disabled
          ? (e) => {
              e.preventDefault()
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}

export default DisableContent
