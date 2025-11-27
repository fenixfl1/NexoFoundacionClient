import React from 'react'
import { Steps, StepsProps } from 'antd'

const CustomSteps: React.FC<StepsProps> = ({
  direction = 'horizontal',
  ...props
}) => {
  return <Steps direction={direction} {...props} />
}

export default CustomSteps
