import { Form, FormInstance } from 'antd'
import React from 'react'
import ConditionalComponent from 'src/components/ConditionalComponent'
import CustomCheckbox from 'src/components/custom/CustomCheckbox'
import CustomCollapseFormList from 'src/components/custom/CustomCollapseFormList'
import CustomFormItem from 'src/components/custom/CustomFormItem'
import CustomInput from 'src/components/custom/CustomInput'
import CustomMaskedInput from 'src/components/custom/CustomMaskedInput'
import CustomRow from 'src/components/custom/CustomRow'
import CustomSelect from 'src/components/custom/CustomSelect'
import CustomSpace from 'src/components/custom/CustomSpace'
import { ContactType, ContactUsage } from 'src/services/contact/contact.types'
import { PersonPayload } from 'src/services/people/people.types'
import capitalize from 'src/utils/capitalize'

interface ContactFormProps {
  form: FormInstance<PersonPayload>
  type: ContactType
}

const ContactForm: React.FC<ContactFormProps> = ({ type, form }) => {
  const contacts: PersonPayload['CONTACTS'] = Form.useWatch(type, form)
  const label: Partial<Record<ContactType, string>> = {
    email: 'Email',
    phone: 'Teléfono',
  }

  const usageOptions = {
    [ContactType.PHONE]: [
      { label: 'Personal', value: ContactUsage.PERSONAL },
      { label: 'Emergencia', value: ContactUsage.EMERGENCY },
    ],
    [ContactType.EMAIL]: [
      { label: 'Personal', value: ContactUsage.PERSONAL },
      { label: 'Institucional', value: ContactUsage.INSTITUTIONAL },
    ],
  }

  return (
    <CustomSpace>
      <CustomCollapseFormList
        form={form}
        name={type}
        onAdd={(add) => add({ IS_PRIMARY: false, TYPE: type })}
        addButtonPosition={'bottom'}
        itemLabel={(index) => capitalize(contacts?.[index]?.USAGE ?? '')}
        sort={'DESC'}
      >
        {(field) => (
          <CustomRow justify={'space-between'} align={'middle'}>
            <CustomSpace
              direction={'horizontal'}
              width={'max-content'}
              size={'large'}
            >
              <CustomFormItem noStyle hidden name={[field.name, 'TYPE']} />

              <ConditionalComponent
                condition={type === ContactType.EMAIL}
                fallback={
                  <CustomFormItem
                    label={label[type]}
                    name={[field.name, 'VALUE']}
                    rules={[{ required: true }]}
                  >
                    <CustomMaskedInput
                      type={'phone'}
                      placeholder={'(000) 000-0000'}
                    />
                  </CustomFormItem>
                }
              >
                <CustomFormItem
                  label={label[type]}
                  name={[field.name, 'VALUE']}
                  rules={[
                    {
                      required: true,
                      type: 'email',
                    },
                  ]}
                >
                  <CustomInput placeholder={'user@example.com'} />
                </CustomFormItem>
              </ConditionalComponent>

              <CustomFormItem
                labelCol={{ span: 8 }}
                label={'Uso'}
                name={[field.name, 'USAGE']}
                rules={[{ required: true }]}
              >
                <CustomSelect
                  style={{ minWidth: '150px' }}
                  placeholder={'Seleccionar uso'}
                  width={'100%'}
                  options={usageOptions[type]}
                />
              </CustomFormItem>
              <CustomFormItem
                style={{ marginLeft: '50px' }}
                label={'Principal?'}
                name={[field.key, 'IS_PRIMARY']}
                labelCol={{ span: 20 }}
                valuePropName={'checked'}
                rules={[{ required: false }]}
              >
                <CustomCheckbox
                  onChange={(e) => {
                    if (!e.target.checked) return

                    const allContacts = [...(contacts || [])]

                    const updatedContacts = allContacts.map((contact, idx) => {
                      return {
                        ...contact,
                        IS_PRIMARY: idx === field.name,
                      }
                    })

                    form.setFieldsValue({ [type]: updatedContacts })
                  }}
                />
              </CustomFormItem>
            </CustomSpace>
          </CustomRow>
        )}
      </CustomCollapseFormList>
    </CustomSpace>
  )
}

export default ContactForm
