import React from 'react'
import { DatePicker } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'

import 'dayjs/locale/es'
import { DATE_FORMAT } from 'src/utils/data-utils'

const { RangePicker } = DatePicker

const CustomRangePicker = React.forwardRef<unknown, RangePickerProps>(
  ({ format = DATE_FORMAT, width, style, ...props }, ref) => {
    return (
      <RangePicker
        format={format}
        ref={ref as never}
        style={{ ...style, width }}
        {...props}
      />
    )
  }
)

export default CustomRangePicker
