import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useAtomValue } from 'jotai'

const NOTIFICATION_TYPE_TITLES = {
  newEvents: 'Новые мероприятия',
  newUserRegistred: 'Регистрация нового пользователя',
  eventRegistration: 'Запись/отписка на мероприятие',
  serviceRegistration: 'Заявка на услугу',
  birthdays: 'Дни рождения',
  remindDates: 'Особые даты',
}

const normalizeHistoryList = (value) => {
  const source = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? Object.values(value)
      : []

  return source
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      notificationId: String(item?.notificationId || ''),
      title: String(item?.title || 'Половинка успеха'),
      body: String(item?.body || ''),
      url: String(item?.url || ''),
      tag: String(item?.tag || ''),
      location: String(item?.location || ''),
      type: String(item?.type || ''),
      types: Array.isArray(item?.types) ? item.types.map(String).filter(Boolean) : [],
      channels:
        item?.channels && typeof item.channels === 'object' ? item.channels : {},
      createdAt: item?.createdAt ? new Date(item.createdAt) : null,
    }))
    .filter((item) => item.createdAt && !Number.isNaN(item.createdAt.getTime()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

const notificationTypeLabel = (item) => {
  const types =
    Array.isArray(item?.types) && item.types.length > 0
      ? item.types
      : item?.type
        ? [item.type]
        : []
  if (types.length === 0) return 'Тип не определен'
  return types.map((type) => NOTIFICATION_TYPE_TITLES[type] || type).join(', ')
}

const notificationsHistoryFunc = () => {
  const NotificationsHistoryModal = () => {
    const loggedUserActive = useAtomValue(loggedUserActiveAtom)
    const history = normalizeHistoryList(
      loggedUserActive?.notifications?.history ??
        loggedUserActive?.notifications?.push?.history
    )

    return (
      <div className="w-full max-h-[70vh] overflow-auto pr-1">
        {history.length === 0 ? (
          <div className="text-sm text-gray-600">Пока нет сохраненных уведомлений</div>
        ) : (
          history.map((item, index) => (
            <div
              key={`${item.notificationId || item.createdAt?.toISOString?.() || 'item'}-${item.tag}-${index}`}
              className="p-3 mb-2 bg-white border rounded-md border-gray-200"
            >
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs text-gray-600 mt-1">
                Тип: {notificationTypeLabel(item)}
              </div>
              {item.body ? <div className="text-sm mt-1">{item.body}</div> : null}
              <div className="text-xs text-gray-600 mt-1">
                Push:{' '}
                {item?.channels?.push?.success
                  ? 'доставлено'
                  : item?.channels?.push?.attempted
                    ? `ошибка${item?.channels?.push?.error ? ` (${item.channels.push.error})` : ''}`
                    : 'не отправлялось'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {item.createdAt?.toLocaleString?.('ru-RU') || ''}
              </div>
              {item.url ? (
                <a
                  href={item.url}
                  className="text-xs underline text-general mt-1 inline-block"
                >
                  Открыть
                </a>
              ) : null}
            </div>
          ))
        )}
      </div>
    )
  }

  return {
    title: 'История уведомлений',
    confirmButtonShow: false,
    declineButtonShow: false,
    onlyCloseButtonShow: true,
    closeButtonName: 'Закрыть',
    Children: NotificationsHistoryModal,
  }
}

export default notificationsHistoryFunc
