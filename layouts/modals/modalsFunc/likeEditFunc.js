import DateTimeEvent from '@components/DateTimeEvent'
import { UserItem } from '@components/ItemCards'
import Note from '@components/Note'
import UserName from '@components/UserName'
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import compareArrays from '@helpers/compareArrays'
import { modalsFuncAtom } from '@state/atoms'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import eventParticipantsFullWithoutRelationshipByEventIdSelector from '@state/selectors/eventParticipantsFullWithoutRelationshipByEventIdSelector'
import eventSelector from '@state/selectors/eventSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const Heart = ({ small, broken, gray }) => (
  <FontAwesomeIcon
    className={cn('duration-300', small ? 'w-5 h-5' : 'w-9 h-9')}
    icon={broken ? faHeartBroken : faHeart}
    color={gray ? '#9ca3af' : '#EC4899'}
  />
)

const CoincidenceItem = ({ user, coincidence, like }) => {
  const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  return (
    <div
      key={'like' + user._id}
      className="flex items-center pl-1 overflow-hidden border border-gray-500 rounded gap-x-1"
    >
      {coincidence ? (
        <div className="relative flex items-center justify-center w-10 h-10 min-w-8 min-h-8">
          <FontAwesomeIcon className="w-9 h-9" icon={faHeart} color="#EC4899" />
          <FontAwesomeIcon
            className="absolute w-9 h-9 animate-ping-light"
            icon={faHeart}
            color="#EC4899"
          />
        </div>
      ) : (
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 min-w-8 min-h-8',
            like ? 'text-pink-300' : 'text-gray-300'
          )}
        >
          <FontAwesomeIcon
            className="w-8 h-8"
            icon={faHeart}
            // color="#EC4899"
          />
        </div>
      )}
      <UserItem
        item={user}
        onClick={
          coincidence || isLoggedUserMember
            ? () =>
                modalsFunc.user.view(user._id, {
                  showContacts: coincidence,
                })
            : undefined
        }
        noBorder
        hideGender
        className={coincidence ? 'bg-hearts hover:bg-none' : ''}
      />
    </div>
  )
}

const likeEditFunc = ({ eventId, userId }, adminView) => {
  const LikeEditModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
    setBottomLeftButtonProps,
    setTopLeftComponent,
    setConfirmButtonName,
    setCloseButtonShow,
    setDeclineButtonShow,
    setTitle,
  }) => {
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const event = useRecoilValue(eventSelector(eventId))
    const user = useRecoilValue(userSelector(userId))
    const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))
    const eventUser = eventUsers.find(
      (eventUser) => eventUser.userId === userId
    )
    const participantsWithoutRelationship = useRecoilValue(
      eventParticipantsFullWithoutRelationshipByEventIdSelector(eventId)
    )

    const setEventUserData = useRecoilValue(itemsFuncAtom).event.setData
    const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)

    if (!eventUser)
      return adminView
        ? 'Произошла ошибка. Не найдена запись пользователя'
        : 'Произошла ошибка. Или вы не можете ставить лайки. Обратитесь к администратору!'

    if (
      !event.likesProcessActive &&
      (!eventUser?.likes || eventUser?.likes.length === 0)
    )
      return adminView
        ? 'Этот пользователь не поставил ни одного лайка'
        : 'Вы не поставили ни одного лайка'

    const userGender = user.gender
    const otherGenderEventUsers = participantsWithoutRelationship.filter(
      ({ user }) =>
        userGender === 'male'
          ? user.gender === 'famale'
          : user.gender === 'male'
    )

    const NoteComponent = (props) => (adminView ? null : <Note {...props} />)

    const eventUsersOtherGenderWithCoincidences = otherGenderEventUsers.map(
      (eventUser2) => ({
        ...eventUser2,
        coincidence: eventUser2.likes?.includes(eventUser.userId),
        like: eventUser.likes?.includes(eventUser2.userId),
      })
    )

    const coincidences = eventUsersOtherGenderWithCoincidences.filter(
      (eventUser) => eventUser.coincidence
    )
    const notCoincidences = eventUsersOtherGenderWithCoincidences.filter(
      (eventUser) => !eventUser.coincidence && eventUser.like
    )
    const other = eventUsersOtherGenderWithCoincidences.filter(
      (eventUser) => !eventUser.coincidence && !eventUser.like
    )

    const onClickConfirm = () => {
      setEventUserData(eventId, {
        likes: {
          [eventUser._id]: likes,
        },
      })
      closeModal()
    }

    const [likes, setLikes] = useState(eventUser.likes ?? [])

    useEffect(() => {
      if (!adminView && !eventUser.seeLikesResult) {
        setEventUserData(
          eventId,
          {
            seeLikesResult: {
              [eventUser._id]: true,
            },
          },
          true
        )
      }
    }, [eventUser.seeLikesResult, adminView])

    useEffect(() => {
      const isFormChanged = !compareArrays(eventUser.likes ?? [], likes)
      setConfirmButtonName(
        !likes || likes?.length === 0
          ? `Решил${user.gender === 'male' ? '' : 'а'} никому не ставить лайки`
          : eventUser.likes && !isFormChanged
          ? 'Оставить как было'
          : adminView
          ? 'Сохранить выбор'
          : 'Отправить мой выбор'
      )
      // setDisableConfirm(eventUser.likes && !isFormChanged)
      setOnConfirmFunc(
        !event.likesProcessActive
          ? undefined
          : eventUser.likes && !isFormChanged
          ? closeModal
          : onClickConfirm
      )
      setCloseButtonShow(!event.likesProcessActive)
      setDeclineButtonShow(adminView)
      if (!event.likesProcessActive)
        setTitle(
          `Совпадения лайков с участни${user.gender === 'male' ? 'ц' : 'к'}ами`
        )
    }, [likes, event])

    return (
      <div className="flex flex-col">
        <div className="text-lg font-bold text-center text-general">
          {event.title}
        </div>
        <DateTimeEvent
          wrapperClassName="mb-1 text-base laptop:text-lg font-bold justify-center"
          dateClassName="text-general"
          timeClassName="italic"
          durationClassName="italic text-base font-normal"
          event={event}
          showDayOfWeek
          fullMonth
        />
        {adminView && (
          <div className="flex justify-center w-full mt-1 mb-2 text-lg font-bold">
            <UserName user={user} />
          </div>
        )}
        {event.likesProcessActive && (
          <div>
            <NoteComponent>
              Поставьте понравившемся участни
              {user.gender === 'male' ? 'ц' : 'к'}
              ам лайки (клик по сердечку), после того как все участники сделают
              свой выбор - Вы сможете посмотреть есть ли у Вас совпадения!
            </NoteComponent>
            <NoteComponent>
              <strong>ВАЖНО!</strong> В случае совпадения Вам будут доступны
              контакты (телефон, whatsApp и т.п.) совпавшего человека, но также
              и ему будут доступны указанные в вашей анкете контакты!
            </NoteComponent>
          </div>
        )}
        {event.likesProcessActive ? (
          <div className="flex flex-col gap-y-0.5">
            {otherGenderEventUsers.map(({ user }) => {
              const checked = likes.includes(user._id)
              return (
                <div
                  key={'like' + user._id}
                  className="flex items-center pl-1 overflow-hidden border border-gray-500 rounded gap-x-1"
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 min-w-8 min-h-8',
                      event.likesProcessActive ? 'cursor-pointer group' : ''
                    )}
                    onClick={
                      event.likesProcessActive
                        ? () =>
                            setLikes((state) =>
                              checked
                                ? state.filter((id) => id !== user._id)
                                : [...state, user._id]
                            )
                        : undefined
                    }
                  >
                    <FontAwesomeIcon
                      className={cn(
                        'duration-300',
                        checked ? 'w-9 h-9' : 'w-7 h-7 group-hover:scale-110'
                      )}
                      icon={faHeart}
                      color={checked ? '#EC4899' : '#9ca3af'}
                    />
                  </div>
                  <UserItem
                    item={user}
                    onClick={
                      isLoggedUserMember
                        ? () => modalsFunc.user.view(user._id)
                        : undefined
                    }
                    noBorder
                    hideGender
                    className={checked ? 'bg-pink-100' : ''}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-y-0.5">
            {coincidences.length > 0 ? (
              <>
                <div className="flex items-center justify-center text-xl font-bold">
                  <Heart small />
                  <div className="px-3 text-center text-pink-700">
                    СОВПАДЕНИЯ
                  </div>
                  <Heart small />
                </div>
                {coincidences.map(({ user, coincidence, like }) => (
                  <CoincidenceItem
                    key={'coincidence' + user._id}
                    user={user}
                    coincidence={coincidence}
                    like={like}
                  />
                ))}
              </>
            ) : (
              <NoteComponent>
                К сожалению на этом мероприятии у Вас нет совпадений, но не
                расстраивайтесь, постарайтесь на будущих мероприятиях немного
                лучше проявлять себя, и тогда Вас точно заметят!
              </NoteComponent>
            )}
            {notCoincidences.length > 0 ? (
              <>
                <div className="flex items-center justify-center mt-3 text-xl font-bold">
                  <Heart small broken gray />
                  <div className="px-3 text-center text-gray-700">
                    НЕ СОВПАЛИ
                  </div>
                  <Heart small broken gray />
                </div>
                {notCoincidences.map(({ user, coincidence, like }) => (
                  <CoincidenceItem
                    key={'noCoincidence' + user._id}
                    user={user}
                    coincidence={coincidence}
                    like={like}
                  />
                ))}
              </>
            ) : (
              <NoteComponent>
                {eventUser.likes.length === 1
                  ? 'Вы поставили всего один лайк и он совпал! Судьба?'
                  : 'Очень здорово, что все поставленные Вами симпатии (лайки) оказались взаимными! Вероятно вы очень хорошо чувствуете людей и это взаимно!'}
              </NoteComponent>
            )}
            {other.length > 0 ? (
              <>
                <div className="flex items-center justify-center px-3 mt-3 text-xl font-bold text-center text-gray-700">
                  ВЫ НЕ ПОСТАВИЛИ ЛАЙК
                </div>
                {other.map(({ user, coincidence, like }) => (
                  <CoincidenceItem
                    key={'noLikes' + user._id}
                    user={user}
                    coincidence={coincidence}
                    like={like}
                  />
                ))}
              </>
            ) : (
              <NoteComponent className="mt-3">
                С одной стороны очень здорово, что на этом мероприятии Вы
                абсолютно всем поставили лайк, но всетаки рекомендуем Вам,
                ставить лайки более избирательно
              </NoteComponent>
            )}
          </div>
        )}
        {/* <UserLikesItem
          user={user}
          acceptedIds={acceptedIds}
          onChange={setLikes}
          // activeIds={mansResult[user._id]}
          selectedIds={likes}
          showContacts={false}
          // otherUsersData={womans}
        /> */}
      </div>
    )
  }

  return {
    title: `Лайки участникам мероприятия`,
    // declineButtonName: 'Оставить как было',
    // confirmButtonName: 'Применить',
    Children: LikeEditModal,
  }
}

export default likeEditFunc
