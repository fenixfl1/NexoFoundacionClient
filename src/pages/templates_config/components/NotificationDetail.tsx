import React, { useMemo } from 'react'
import CustomDrawer from 'src/components/custom/CustomDrawer'
import CustomSpin from 'src/components/custom/CustomSpin'
import CustomDescriptions from 'src/components/custom/CustomDescription'
import CustomDivider from 'src/components/custom/CustomDivider'
import CustomTag from 'src/components/custom/CustomTag'
import CustomAlert from 'src/components/custom/CustomAlert'
import CustomIceEditor from 'src/components/custom/CustomIceEditor'
import { useGetNotificationQuery } from 'src/services/notifications/useGetNotificationQuery'
import { notificationChannelOptions, notificationStatusOptions } from '../constants'
import formatter from 'src/utils/formatter'

interface NotificationDetailProps {
  notificationId?: number
  open?: boolean
  onClose?: () => void
}

const NotificationDetail: React.FC<NotificationDetailProps> = ({
  notificationId,
  open,
  onClose,
}) => {
  const { data, isFetching } = useGetNotificationQuery(notificationId, open)

  const statusOption = notificationStatusOptions.find(
    (item) => item.value === data?.STATUS
  )
  const channelOption = notificationChannelOptions.find(
    (item) => item.value === data?.CHANNEL
  )

  const payloadValue = useMemo(
    () => JSON.stringify(data?.PAYLOAD ?? {}, null, 2),
    [data?.PAYLOAD]
  )

  return (
    <CustomDrawer
      width={'50%'}
      open={open}
      onClose={onClose}
      title={`Detalle de notificación #${notificationId ?? ''}`}
    >
      <CustomSpin spinning={isFetching}>
        <CustomDescriptions
          size="small"
          column={1}
          items={[
            {
              key: 'recipient',
              label: 'Destinatario',
              children: data?.RECIPIENT,
            },
            {
              key: 'channel',
              label: 'Canal',
              children: channelOption?.label ?? data?.CHANNEL,
            },
            {
              key: 'status',
              label: 'Estado',
              children: statusOption ? (
                <CustomTag color={statusOption.color as never}>
                  {statusOption.label}
                </CustomTag>
              ) : (
                data?.STATUS
              ),
            },
            {
              key: 'template',
              label: 'Plantilla',
              children: data?.TEMPLATE_NAME
                ? `${data.TEMPLATE_NAME} (${data.TEMPLATE_KEY})`
                : 'Manual',
            },
            {
              key: 'scheduled',
              label: 'Programada para',
              children: data?.SCHEDULED_AT
                ? formatter({ value: data.SCHEDULED_AT, format: 'datetime' })
                : 'No programada',
            },
            {
              key: 'sentAt',
              label: 'Enviada',
              children: data?.SENT_AT
                ? formatter({ value: data.SENT_AT, format: 'datetime' })
                : 'Pendiente',
            },
          ]}
        />

        {data?.ERROR_MESSAGE ? (
          <>
            <CustomDivider>Último error</CustomDivider>
            <CustomAlert
              type="error"
              message={data.ERROR_MESSAGE}
              showIcon
            />
          </>
        ) : null}

        <CustomDivider>Contenido generado</CustomDivider>
        <CustomIceEditor
          mode="html"
          minLines={8}
          maxLines={16}
          value={data?.BODY ?? ''}
          readOnly
        />

        <CustomDivider>Payload</CustomDivider>
        <CustomIceEditor
          mode="json"
          minLines={8}
          maxLines={16}
          value={payloadValue}
          readOnly
        />
      </CustomSpin>
    </CustomDrawer>
  )
}

export default NotificationDetail
