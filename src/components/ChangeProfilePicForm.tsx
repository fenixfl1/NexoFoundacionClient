import { BulbOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd'
import React, { useEffect } from 'react'
import { formItemLayout } from 'src/config/breakpoints'
import CustomAlert from './custom/CustomAlert'
import CustomFormItem from './custom/CustomFormItem'
import CustomFrom from './custom/CustomForm'
import CustomInput from './custom/CustomInput'
import CustomInputGroup from './custom/CustomInputGroup'
import CustomModal from './custom/CustomModal'
import CustomRow from './custom/CustomRow'
import CustomSpin from './custom/CustomSpin'
import CustomTooltip from './custom/CustomTooltip'
import CustomUpload from './custom/CustomUpload'
import { getSessionInfo } from 'src/lib/session'

interface ChangeProfilePicFormProps {
  open: boolean
  onClose: () => void
  onFinish: () => void
  loading?: boolean
  form: FormInstance
}

const ChangeProfilePicForm: React.FC<ChangeProfilePicFormProps> = ({
  open,
  onClose,
  onFinish,
  loading,
  form,
}) => {
  useEffect(() => {
    form.setFieldsValue({
      USERNAME: getSessionInfo().username,
      USER_ID: getSessionInfo().userId,
    })
  }, [])

  return (
    <CustomModal
      open={open}
      onCancel={onClose}
      title={'Cambiar foto de perfil'}
      onOk={onFinish}
    >
      <CustomSpin spinning={loading}>
        <CustomRow width={'100%'}>
          <CustomFrom
            style={{ width: '100%' }}
            layout="vertical"
            form={form}
            {...formItemLayout}
          >
            <CustomFormItem name={'USERNAME'} hidden noStyle />
            <CustomFormItem name={'USER_ID'} hidden noStyle />
            <CustomAlert
              closable
              message={'Tips'}
              showIcon
              icon={<BulbOutlined />}
              description={
                'Puedes cargar una imagen desde tu dispositivo o pegar la URL de la imagen'
              }
              type={'info'}
            />
            <CustomFormItem>
              <CustomInputGroup>
                <CustomFormItem noStyle name={'PREFIX'} initialValue={'HTTPS'}>
                  <CustomInput disabled width={'10%'} />
                </CustomFormItem>
                <CustomFormItem
                  noStyle
                  rules={[{ type: 'url' }]}
                  name={'AVATAR_URL'}
                >
                  <CustomInput
                    placeholder={'https://some-image-url.com'}
                    width={'80%'}
                  />
                </CustomFormItem>
                <CustomTooltip title={'Cargar image desde mi dispositivo'}>
                  <CustomFormItem
                    noStyle
                    name={'AVATAR_FILE'}
                    // normalize={normalizeFiles}
                    valuePropName={'fileList'}
                  >
                    <CustomUpload listType={'text'} accept={'image/*'} />
                  </CustomFormItem>
                </CustomTooltip>
              </CustomInputGroup>
            </CustomFormItem>
          </CustomFrom>
        </CustomRow>
      </CustomSpin>
    </CustomModal>
  )
}

export default ChangeProfilePicForm
