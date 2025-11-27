import { CollapseProps, FormInstance } from 'antd'
import React, { useState } from 'react'
import CustomCollapse from 'src/components/custom/CustomCollapse'
import ContactForm from './ContactForm'
import { ContactType } from 'src/services/contact/contact.types'

interface ContactsProps {
  form: FormInstance
}

const Contacts: React.FC<ContactsProps> = ({ form }) => {
  const [activeKey, setActiveKey] = useState<number[]>([0])
  const items: CollapseProps['items'] = [
    {
      label: 'Teléfonos',
      key: 0,
      children: <ContactForm form={form} type={ContactType.PHONE} />,
    },
    {
      label: 'Correos',
      key: 1,
      children: <ContactForm form={form} type={ContactType.EMAIL} />,
    },
  ]
  return (
    <CustomCollapse
      accordion
      activeKey={activeKey}
      onChange={(keys) => setActiveKey(keys.map((key) => Number(key)))}
      defaultActiveKey={activeKey}
      items={items}
    />
  )
}

export default Contacts
