import InputImages from '@components/InputImages'
import { USERS_ROLES, USERS_STATUSES } from '@helpers/constants'
import formatDateTime from '@helpers/formatDateTime'

const Item = ({ title, text }) => (
  <div className="flex gap-x-1">
    <div className="flex">
      <div className="font-bold">{title}</div>:
    </div>
    <div>{text}</div>
  </div>
)

const UserKeyValueItem = ({ objKey, value }) =>
  value === null || value === undefined || value === '' ? (
    '[не указано]'
  ) : [
      'firstName',
      'secondName',
      'thirdName',
      'email',
      'about',
      'soctag',
      'custag',
      'personalStatus',
    ].includes(objKey) ? (
    value
  ) : ['phone', 'whatsapp', 'viber'].includes(objKey) ? (
    `+${value}`
  ) : ['birthday', 'lastActivityAt', 'prevActivityAt'].includes(objKey) ? (
    formatDateTime(value)
  ) : objKey === 'password' ? (
    value ? (
      <div className="text-gray-500">{'[пароль скрыт]'}</div>
    ) : (
      '[не задан]'
    )
  ) : objKey === 'role' ? (
    USERS_ROLES.find((item) => item.value === value)?.name
  ) : objKey === 'status' ? (
    USERS_STATUSES.find((item) => item.value === value)?.name
  ) : objKey === 'gender' ? (
    value === 'famale' ? (
      'Женщина'
    ) : (
      'Мужчина'
    )
  ) : objKey === 'images' ? (
    <InputImages
      images={value}
      readOnly
      noMargin
      paddingY={false}
      paddingX={false}
    />
  ) : objKey === 'security' ? (
    <div className="flex flex-col gap-y-1">
      <Item
        title="Показывать фамилию"
        text={value.fullSecondName ? 'Полностью' : 'Только первую букву'}
      />
      <Item
        title="Показывать отчество"
        text={value.fullThirdName ? 'Полностью' : 'Только первую букву'}
      />
      <Item
        title="Показывать дату рождения"
        text={
          value.showBirthday === 'full'
            ? 'Показывать (в том числе возраст)'
            : value.showBirthday === 'noYear'
              ? 'Только день и месяц (скрыть возраст)'
              : 'Не показывать'
        }
      />
      <Item title="Показывать телефон" text={value.showPhone ? 'Да' : 'Нет'} />
      <Item
        title="Показывать Whatsapp"
        text={value.showWhatsapp ? 'Да' : 'Нет'}
      />
      <Item title="Показывать Viber" text={value.showViber ? 'Да' : 'Нет'} />
      <Item
        title="Показывать Телеграм"
        text={value.showTelegram ? 'Да' : 'Нет'}
      />
      <Item
        title="Показывать Instagram"
        text={value.showInstagram ? 'Да' : 'Нет'}
      />
      <Item title="Показывать ВКонтакте" text={value.showVk ? 'Да' : 'Нет'} />
      <Item title="Показывать eMail" text={value.showEmail ? 'Да' : 'Нет'} />
    </div>
  ) : objKey === 'notifications' ? (
    <div className="flex flex-col gap-y-1">
      <Item
        title="Телеграм оповещения активированы"
        text={value.telegram?.active ? 'Да' : 'Нет'}
      />
      <Item
        title="Телеграм подключен"
        text={value.telegram?.id ? 'Да' : 'Нет'}
      />
    </div>
  ) : typeof value === 'object' ? (
    <pre>{JSON.stringify(value)}</pre>
  ) : typeof value === 'boolean' ? (
    value ? (
      'Да'
    ) : (
      'Нет'
    )
  ) : (
    value
  )

export default UserKeyValueItem
