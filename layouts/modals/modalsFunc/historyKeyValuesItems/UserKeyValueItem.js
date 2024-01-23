import InputImages from '@components/InputImages'
import { USERS_ROLES, USERS_STATUSES } from '@helpers/constants'
import formatDateTime from '@helpers/formatDateTime'

const UserKeyValueItem = ({ objKey, value }) =>
  value === null || value === undefined || value === '' ? (
    '[не указано]'
  ) : [
      'firstName',
      'secondName',
      'thirdName',
      'email',
      'about',
      'interests',
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
