import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faGenderless } from '@fortawesome/free-solid-svg-icons/faGenderless'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
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
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventParticipantsFullWithoutRelationshipByEventIdSelector from '@state/selectors/eventParticipantsFullWithoutRelationshipByEventIdSelector'
import arrayToObject from '@helpers/arrayToObject'
import CardButton from './CardButton'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import eventSelector from '@state/selectors/eventSelector'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'

const dayTimeText = () => {
  var date = new Date()
  var hours = date.getHours()
  if (hours >= 5 && hours <= 11) return 'Доброе утро'
  if (hours >= 12 && hours <= 17) return 'Добрый день'
  if (hours >= 17 && hours <= 23) return 'Добрый вечер'
  return 'Доброй ночи'
}

const Contacts = ({ user, coincidencUsers, eventLikesNumSort }) => {
  var message =
    `${dayTimeText()}!\n` +
    (coincidencUsers.length > 0
      ? `Поздравляем у вас есть совпадения:${coincidencUsers.map(
          ({ user, likeSortNum }) => {
            const { firstName, secondName, birthday, phone } = user
            return `\n- ${eventLikesNumSort && typeof likeSortNum === 'number' ? `№${likeSortNum + 1} ` : ''}${firstName} ${
              secondName ? ` ${secondName[0].toUpperCase() + '.'}` : ''
            } (${birthDateToAge(birthday)}) +${phone}`
          }
        )}`
      : `К сожалению вчера у вас ни с кем симпатии не совпали.\u{1F64C}`)

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
  onUpClick,
  onDownClick,
  likeSortNum,
}) => {
  const event = useRecoilValue(eventSelector(eventId))
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  // const userGender =
  //   user.gender && GENDERS.find((gender) => gender.value === user.gender)

  const coincidenceCount = activeIds?.length ?? 0

  return (
    <div
      className={cn(
        'relative flex flex-col px-1 pb-1 border rounded-lg overflow-hidden',
        user.gender == 'male'
          ? 'bg-blue-100 border-blue-500'
          : 'bg-red-100 border-red-500'
      )}
      key={user._id}
    >
      {event.likesNumSort && typeof likeSortNum === 'number' && (
        <div
          className={cn(
            'bg-white absolute top-0 left-0 w-7 h-7 tablet:w-8 tablet:h-8 text-base tablet:text-lg font-bold flex items-center justify-center border-r border-b rounded-br-lg',
            user.gender == 'male' ? 'border-blue-500' : 'border-red-500'
          )}
        >
          {likeSortNum + 1}
        </div>
      )}
      <div className="flex items-center h-10 gap-x-0.5">
        {event.likesNumSort && typeof likeSortNum === 'number' && (
          <div className="w-6 min-w-6 tablet:w-7 tablet:min-w-7" />
        )}
        {!event.likesProcessActive && (
          <div
            className={cn(
              'w-6 min-w-6 tablet:w-8 tablet:min-w-8 flex justify-center items-center',
              seeLikes ? 'text-success' : 'text-danger'
            )}
          >
            <FontAwesomeIcon
              className="w-5 h-5 tablet:w-6 tablet:min-w-6"
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
            className="w-5 h-5 tablet:w-6 tablet:min-w-6"
            icon={selectedIds === null ? faGenderless : faCheck}
          />
        </div>
        {/* <div
          className={cn(
            'w-6 min-w-6 tablet:w-8 tablet:min-w-8 flex justify-center items-center',
            userGender ? 'text-' + userGender.color : 'text-gray-400'
          )}
        >
          <FontAwesomeIcon
            className="w-6 h-6"
            icon={userGender ? userGender.icon : faGenderless}
          />
        </div> */}
        <UserName
          user={user}
          className="text-sm font-bold phoneH:text-base tablet:text-lg text-general"
          leadingClass="leading-3 tablet:leading-[14px]"
        />
        <div className="flex flex-wrap justify-end flex-1 text-sm leading-4 tablet:pr-1 tablet:text-base">
          {/* <div>Совпадений:</div> */}
          <div className="flex items-center whitespace-nowrap gap-x-1">
            {event.likesProcessActive && (
              <div className="flex items-center">
                {onUpClick && (
                  <CardButton
                    icon={faArrowUp}
                    onClick={() => {
                      onUpClick()
                    }}
                    color="gray"
                    tooltipText="Переместить выше"
                  />
                )}
                {onDownClick && (
                  <CardButton
                    icon={faArrowDown}
                    onClick={() => {
                      onDownClick()
                    }}
                    color="gray"
                    tooltipText="Переместить ниже"
                  />
                )}
              </div>
            )}
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
                className="mt-0.5 tablet:mt-1 w-7 h-7 tablet:w-8 tablet:h-8"
                icon={faHeart}
                color={coincidenceCount > 0 ? '#EC4899' : '#9ca3af'}
              />
              {coincidenceCount > 0 && (
                <FontAwesomeIcon
                  className="absolute bottom-0 left-0 right-0 top-1 w-7 h-7 tablet:w-8 tablet:h-8 animate-ping"
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
        <div className="z-10 flex flex-col items-center overflow-hidden border border-gray-500 rounded gap-x-1">
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
              ? otherUsersData.filter(({ user }) =>
                  activeIds.includes(user._id)
                )
              : // .map(({ user }) => user._id)
                []
          }
          eventLikesNumSort={event.likesNumSort}
        />
      )}
    </div>
  )
}

const getLikesObject = (eventUsers) =>
  eventUsers.reduce((a, { userId, likes }) => ({ ...a, [userId]: likes }), {})

const setUp = (array, key, clickedIndex) => {
  if (!clickedIndex || clickedIndex === 0) return []

  var movedUp = false
  var movedDown = false
  const itemsToChange = array
    .map((item) => {
      if (!item[key] && item[key] === 0)
        Object.keys(array).reduce((key, v) => (array[v] < array[key] ? v : key))

      if (item[key] === clickedIndex)
        if (!movedUp) {
          movedUp = true
          return { ...item, [key]: item[key] - 1 }
        }

      if (item[key] === clickedIndex - 1)
        if (!movedDown) {
          movedDown = true
          return { ...item, [key]: item[key] + 1 }
        }
    })
    .filter((item) => item)

  console.log('itemsToChange :>> ', itemsToChange)

  return itemsToChange
  // await Promise.all(
  //   itemsToChange.map(async (item) => {
  //     if (item)
  //       await itemFunc.direction.set({
  //         _id: item._id,
  //         index: item.index,
  //       })
  //   })
  // )
}

const setDown = (array, key, clickedIndex) => {
  if (clickedIndex >= array.length - 1) return []
  console.log('clickedIndex :>> ', clickedIndex)
  console.log('array[clickedIndex] :>> ', array[clickedIndex])

  var movedUp = false
  var movedDown = false
  const itemsToChange = array
    .map((item) => {
      if (item[key] === clickedIndex)
        if (!movedDown) {
          movedDown = true
          return { ...item, [key]: item[key] + 1 }
        }
      if (item[key] === clickedIndex + 1)
        if (!movedUp) {
          movedUp = true
          return { ...item, [key]: item[key] - 1 }
        }
    })
    .filter((item) => item)

  console.log('itemsToChange :>> ', itemsToChange)

  return itemsToChange
  // await Promise.all(
  //   itemsToChange.map(async (item) => {
  //     if (item)
  //       await itemFunc.direction.set({
  //         _id: item._id,
  //         index: item.index,
  //       })
  //   })
  // )
}

const LikesViewer = ({ eventId }) => {
  const event = useRecoilValue(eventSelector(eventId))
  const setEventUser = useRecoilValue(itemsFuncAtom).eventsUser.set
  const eventUsers = useRecoilValue(
    eventParticipantsFullWithoutRelationshipByEventIdSelector(eventId)
  )

  const readOnly = !event.likesProcessActive

  const onDownClick = async (array, key, clickedIndex) => {
    const resultToChange = setDown(array, key, clickedIndex)
    for (let i = 0; i < resultToChange.length; i++) {
      const eventUser = resultToChange[i]
      setEventUser(
        { _id: eventUser._id, likeSortNum: eventUser.likeSortNum },
        false,
        true
      )
    }
  }

  const onUpClick = async (array, key, clickedIndex) => {
    const resultToChange = setUp(array, key, clickedIndex)
    for (let i = 0; i < resultToChange.length; i++) {
      const eventUser = resultToChange[i]
      setEventUser(
        { _id: eventUser._id, likeSortNum: eventUser.likeSortNum },
        false,
        true
      )
    }
  }

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

  const sortedEventMans =
    !event.likesNumSort ||
    eventUsers.find(({ likeSortNum }) => typeof likeSortNum !== 'number')
      ? eventMans
      : [...eventMans].sort((a, b) => (a.likeSortNum > b.likeSortNum ? 1 : -1))

  const sortedEventWomans =
    !event.likesNumSort ||
    eventUsers.find(({ likeSortNum }) => typeof likeSortNum !== 'number')
      ? eventWomans
      : [...eventWomans].sort((a, b) =>
          a.likeSortNum > b.likeSortNum ? 1 : -1
        )

  const userGendersObject = arrayToObject(GENDERS, 'value')

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center justify-center w-full gap-x-1">
        <div className={'text-' + userGendersObject.male.color}>
          <FontAwesomeIcon
            className="w-6 h-6"
            icon={userGendersObject.male.icon}
          />
        </div>
        <div>Мужчины</div>
      </div>
      <div className="flex flex-col gap-y-2">
        {sortedEventMans.map(({ user, seeLikesResult, likeSortNum }) => (
          <UserLikesItem
            key={eventId + user._id}
            user={user}
            activeIds={mansResult[user._id]}
            selectedIds={mansSelections[user._id]}
            otherUsersData={eventWomans}
            readOnly={readOnly}
            eventId={eventId}
            seeLikes={seeLikesResult}
            likeSortNum={event.likesNumSort ? likeSortNum : undefined}
            onUpClick={
              event.likesNumSort && likeSortNum > 0
                ? () => onUpClick(sortedEventMans, 'likeSortNum', likeSortNum)
                : undefined
            }
            onDownClick={
              event.likesNumSort && likeSortNum < sortedEventMans.length - 1
                ? () => onDownClick(sortedEventMans, 'likeSortNum', likeSortNum)
                : undefined
            }
          />
        ))}
      </div>
      <div className="flex items-center justify-center w-full mt-3 gap-x-1">
        <div className={'text-' + userGendersObject.famale.color}>
          <FontAwesomeIcon
            className="w-6 h-6"
            icon={userGendersObject.famale.icon}
          />
        </div>
        <div>Женщины</div>
      </div>
      <div className="flex flex-col gap-y-2">
        {sortedEventWomans.map(({ user, seeLikesResult, likeSortNum }) => (
          <UserLikesItem
            key={eventId + user._id}
            user={user}
            activeIds={womansResult[user._id]}
            selectedIds={womansSelections[user._id]}
            otherUsersData={eventMans}
            readOnly={readOnly}
            eventId={eventId}
            seeLikes={seeLikesResult}
            likeSortNum={event.likesNumSort ? likeSortNum : undefined}
            onUpClick={
              event.likesNumSort && likeSortNum > 0
                ? () => onUpClick(sortedEventWomans, 'likeSortNum', likeSortNum)
                : undefined
            }
            onDownClick={
              event.likesNumSort && likeSortNum < sortedEventWomans.length - 1
                ? () =>
                    onDownClick(sortedEventWomans, 'likeSortNum', likeSortNum)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}

export default LikesViewer
