import formatDateTime from '@helpers/formatDateTime'

const UserKeyValueItem = ({ objKey, value }) =>
  value === null || value === undefined ? (
    '[не указано]'
  ) : [
      'firstName',
      'secondName',
      'thirdName',
      'email',
      'password',
      'about',
      'interests',
      'soctag',
      'custag',
      'personalStatus',
    ].includes(objKey) ? (
    value
  ) : ['birthday', 'lastActivityAt', 'prevActivityAt'].includes(objKey) ? (
    formatDateTime(value)
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
