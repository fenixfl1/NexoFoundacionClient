import React from 'react'
import ConditionalComponent from './ConditionalComponent'
import CustomCard from './custom/CustomCard'
import CustomDivider from './custom/CustomDivider'
import CustomRow from './custom/CustomRow'
import CustomStatistic from './custom/CustomStatistic'

interface DataSource {
  key: string | number
  title: string
  value: string | number
}

interface ModuleSummaryProps {
  dataSource: DataSource[]
  total?: number
  title?: React.ReactNode
}

const ModuleSummary: React.FC<ModuleSummaryProps> = ({
  dataSource,
  total,
  title,
}) => {
  return (
    <CustomCard>
      {title}
      <CustomRow justify={'space-between'}>
        {dataSource.map((item) => (
          <>
            <CustomStatistic
              key={item.key}
              title={item.title}
              value={item.value}
            />
            <CustomDivider type={'vertical'} style={{ margin: 0 }} />
          </>
        ))}

        <ConditionalComponent condition={!isNaN(total)}>
          <CustomStatistic title={'Total'} value={total} />
        </ConditionalComponent>
      </CustomRow>
    </CustomCard>
  )
}

export default ModuleSummary
