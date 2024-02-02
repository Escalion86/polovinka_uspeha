import { SelectUserList } from '@components/SelectItemList'
import UserName from '@components/UserName'
import { faCopy, faGenderless } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GENDERS } from '@helpers/constants'
import cn from 'classnames'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import useCopyToClipboard from '@helpers/useCopyToClipboard'

const dayTimeText = () => {
  var date = new Date()
  var hours = date.getHours()
  if (hours >= 5 && hours <= 11) return 'Доброе утро'
  if (hours >= 12 && hours <= 17) return 'Добрый день'
  if (hours >= 17 && hours <= 23) return 'Добрый вечер'
  return 'Доброй ночи'
}

const Contacts = ({ user, coincidencUsers }) => {
  var message =
    `${dayTimeText()}!\n` +
    (coincidencUsers.length > 0
      ? `Поздравляем у вас есть совпадения:${coincidencUsers.map(
          ({ firstName, secondName, birthday, phone }) =>
            `\n- ${firstName} ${
              secondName ? ` ${secondName[0].toUpperCase() + '.'}` : ''
            } (${birthDateToAge(birthday)}) +${phone}`
        )}`
      : `К сожалению вчера у вас не с кем симпатии не совпали.\u{1F64C}`)

  const copyMessage = useCopyToClipboard(
    message,
    'Сообщение скопировано в буфер обмена'
  )

  return (
    <div className="flex items-center justify-end mt-1">
      <div className="mr-1">Результат: </div>
      <FontAwesomeIcon
        className="h-6 text-blue-600 duration-300 cursor-pointer hover:text-toxic hover:scale-110"
        icon={faCopy}
        onClick={(event) => {
          event.stopPropagation()
          copyMessage()
        }}
      />
      <div className="flex-1 mr-1 text-right">Отправить: </div>
      <ContactsIconsButtons
        className="px-2"
        user={user}
        // message={message}
        smsViaPhone
        forceWhatsApp
      />
    </div>
  )
}

const UserLikesItem = ({
  user,
  acceptedIds,
  onChange,
  activeIds,
  selectedIds,
  showContacts,
  otherUsersData,
  readOnly,
}) => {
  const userGender =
    user.gender && GENDERS.find((gender) => gender.value === user.gender)

  const coincidenceCount = activeIds?.length ?? 0
  return (
    <div
      className={cn(
        'flex flex-col px-1 pb-1 border rounded-lg',
        user.gender == 'male'
          ? 'bg-blue-100 border-blue-500'
          : 'bg-red-100 border-red-500'
      )}
      key={user._id}
    >
      <div className="flex items-center h-10">
        <div
          className={cn(
            'w-6 min-w-6 tablet:w-8 tablet:min-w-8 flex justify-center items-center',
            userGender ? 'text-' + userGender.color : 'text-gray-400'
          )}
        >
          <FontAwesomeIcon
            className="w-6 h-6"
            icon={userGender ? userGender.icon : faGenderless}
          />
        </div>
        <UserName
          user={user}
          className="text-base font-bold tablet:text-lg text-general"
        />
        <div className="flex flex-wrap justify-end flex-1 text-sm leading-4 tablet:pr-1 tablet:text-base">
          <div>Совпадений:</div>
          <div className="whitespace-nowrap">
            <span
              className={cn(
                'pl-1 font-bold',
                coincidenceCount > 0 ? 'text-success' : 'text-danger'
              )}
            >
              {coincidenceCount}
            </span>
            <span className="pl-1"> / {selectedIds?.length ?? 0}</span>
          </div>
        </div>
      </div>
      <div className="z-10">
        <SelectUserList
          usersId={selectedIds}
          onChange={onChange}
          acceptedIds={acceptedIds}
          showCounter={false}
          canSelectNone
          activeIds={activeIds}
          readOnly={readOnly}
        />
      </div>
      {showContacts && (
        <Contacts
          user={user}
          coincidencUsers={
            activeIds
              ? otherUsersData.filter((user) => activeIds.includes(user._id))
              : []
          }
        />
      )}
    </div>
  )
}

export default UserLikesItem
