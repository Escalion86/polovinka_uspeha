import {
  faCheck,
  faCopy,
  faEye,
  faEyeSlash,
  faGenderless,
  faHeart,
  faHeartBroken,
  faPencil,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GENDERS } from '@helpers/constants'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import { UserItem } from './ItemCards'
import ContactsIconsButtons from './ContactsIconsButtons'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import birthDateToAge from '@helpers/birthDateToAge'
import cn from 'classnames'
import UserName from './UserName'
import eventSelector from '@state/selectors/eventSelector'
import eventParticipantsFullWithoutRelationshipByEventIdSelector from '@state/selectors/eventParticipantsFullWithoutRelationshipByEventIdSelector'

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
  activeIds,
  selectedIds,
  otherUsersData,
  readOnly,
  eventId,
  seeLikes,
}) => {
  const event = useRecoilValue(eventSelector(eventId))
  const modalsFunc = useRecoilValue(modalsFuncAtom)
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
      <div className="flex items-center h-10 gap-x-0.5">
        {!event.likesProcessActive && (
          <div
            className={cn(
              'w-6 min-w-6 tablet:w-8 tablet:min-w-8 flex justify-center items-center',
              seeLikes ? 'text-success' : 'text-danger'
            )}
          >
            <FontAwesomeIcon
              className="w-6 h-6"
              icon={seeLikes ? faEye : faEyeSlash}
            />
          </div>
        )}
        <div
          className={cn(
            'w-6 min-w-6 tablet:w-8 tablet:min-w-8 flex justify-center items-center',
            selectedIds === null ? 'text-gray-400' : 'text-success'
          )}
        >
          <FontAwesomeIcon
            className="w-6 h-6"
            icon={selectedIds === null ? faGenderless : faCheck}
          />
        </div>
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
          {/* <div>Совпадений:</div> */}
          <div className="flex items-center whitespace-nowrap gap-x-1">
            {/* <span
              className={cn(
                'pl-1 font-bold',
                coincidenceCount > 0 ? 'text-success' : 'text-danger'
              )}
            >
              {coincidenceCount}
            </span> */}
            <div className="relative">
              <FontAwesomeIcon
                className="w-7 h-7"
                icon={faHeart}
                color={coincidenceCount > 0 ? '#EC4899' : '#9ca3af'}
              />
              {coincidenceCount > 0 && (
                <FontAwesomeIcon
                  className="absolute top-0 bottom-0 left-0 right-0 w-7 h-7 animate-ping"
                  icon={faHeart}
                  color="#EC4899"
                />
              )}
              <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center text-white">
                {coincidenceCount}
              </div>
            </div>
            <div> / {selectedIds?.length ?? 0}</div>
          </div>
        </div>
        {!readOnly && (
          <div
            className="flex items-center justify-center w-6 text-orange-400 cursor-pointer group min-w-6 tablet:w-8 tablet:min-w-8"
            onClick={() =>
              modalsFunc.eventUser.editLike(
                {
                  eventId,
                  userId: user._id,
                },
                true
              )
            }
          >
            <FontAwesomeIcon
              className="w-5 h-5 duration-300 group-hover:scale-110"
              icon={faPencil}
            />
          </div>
        )}
      </div>
      {selectedIds?.length > 0 ? (
        <div className="z-10 flex flex-col items-center pl-1 overflow-hidden border border-gray-500 rounded gap-x-1">
          {otherUsersData
            .filter(({ user }) => selectedIds.includes(user._id))
            .map(({ user }, index) => (
              <UserItem
                key={'likes' + user._id}
                item={user}
                onClick={() => modalsFunc.user.view(user._id)}
                noBorder
                hideGender
                className={cn(
                  activeIds?.includes(user._id)
                    ? 'bg-hearts hover:bg-none'
                    : 'bg-white',
                  index > 0 ? 'border-t border-t-gray-500' : ''
                )}
              />
            ))}
        </div>
      ) : (
        <div>
          {selectedIds === null
            ? 'Пользователь не принимал участия'
            : 'Пользователь никого не выбрал'}
        </div>
      )}
      {!event.likesProcessActive && (
        <Contacts
          user={user}
          coincidencUsers={
            activeIds
              ? otherUsersData
                  .filter(({ user }) => activeIds.includes(user._id))
                  .map(({ user }) => user._id)
              : []
          }
        />
      )}
    </div>
  )
}

const getLikesObject = (eventUsers) =>
  eventUsers.reduce((a, { userId, likes }) => ({ ...a, [userId]: likes }), {})

const LikesViewer = ({ eventId, readOnly }) => {
  const eventUsers = useRecoilValue(
    eventParticipantsFullWithoutRelationshipByEventIdSelector(eventId)
  )

  const eventMans = eventUsers.filter(({ user }) => user.gender === 'male')
  const eventWomans = eventUsers.filter(({ user }) => user.gender === 'famale')

  const mansSelections = getLikesObject(eventMans)
  const womansSelections = getLikesObject(eventWomans)

  const mansResult = {}
  const womansResult = {}
  for (const [manId, value] of Object.entries(mansSelections)) {
    if (value !== null && typeof value === 'object') {
      value.forEach((womanId) => {
        if (
          womansSelections[womanId] &&
          womansSelections[womanId].includes(manId)
        ) {
          if (!mansResult[manId]) {
            mansResult[manId] = [womanId]
          } else {
            mansResult[manId].push(womanId)
          }
          if (!womansResult[womanId]) {
            womansResult[womanId] = [manId]
          } else {
            womansResult[womanId].push(manId)
          }
        }
      })
    }
  }

  if (eventMans.length === 0 || eventWomans.length === 0)
    return <div>Похоже что в мероприятии недостаточно участников</div>

  return (
    <div className="flex flex-col gap-y-1">
      <div></div>
      <div className="flex flex-col gap-y-2">
        {eventMans.map(({ user, seeLikesResult }) => (
          <UserLikesItem
            key={eventId + user._id}
            user={user}
            activeIds={mansResult[user._id]}
            selectedIds={mansSelections[user._id]}
            otherUsersData={eventWomans}
            readOnly={readOnly}
            eventId={eventId}
            seeLikes={seeLikesResult}
          />
        ))}
        {eventWomans.map(({ user, seeLikesResult }) => (
          <UserLikesItem
            key={eventId + user._id}
            user={user}
            activeIds={womansResult[user._id]}
            selectedIds={womansSelections[user._id]}
            otherUsersData={eventMans}
            readOnly={readOnly}
            eventId={eventId}
            seeLikes={seeLikesResult}
          />
        ))}
      </div>
    </div>
  )
}

export default LikesViewer
