import { Calendar } from 'antd'
import { CalendarProps } from 'antd/lib/calendar'
import { Dayjs } from 'dayjs'
import React from 'react'

const CustomCalendar: React.FC<CalendarProps<Dayjs>> = ({ ...props }) => {
  return <Calendar {...props} />
}

export default CustomCalendar
