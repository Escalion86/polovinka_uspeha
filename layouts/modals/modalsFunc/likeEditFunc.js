import DateTimeEvent from '@components/DateTimeEvent'
import { UserItem } from '@components/ItemCards'
import Note from '@components/Note'
import UserName from '@components/UserName'
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons/faHeartBroken'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import modalsFuncAtom from '@state/modalsFuncAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import eventParticipantsFullWithoutRelationshipByEventIdSelector from '@state/selectors/eventParticipantsFullWithoutRelationshipByEventIdSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import { unwrap } from 'jotai/utils'
import eventSelector from '@state/selectors/eventSelector'

const Heart = ({ small, broken, gray }) => (
  <FontAwesomeIcon
    className={cn(
      'duration-300',
      small ? 'w-5 h-5 min-h-5 min-w-5' : 'w-9 h-9 min-h-9 min-w-9'
    )}
    icon={broken ? faHeartBroken : faHeart}
    color={gray ? '#9ca3af' : '#EC4899'}
  />
)

const CoincidenceItem = ({ user, coincidence, like, likeSortNum }) => {
  const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
  const modalsFunc = useAtomValue(modalsFuncAtom)

  return (
    <div
      key={'like' + user._id}
      className="flex items-center pl-1 overflow-hidden border border-gray-500 rounded-sm gap-x-1"
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
      {typeof likeSortNum === 'number' && (
        <div className="flex items-center justify-center w-10 h-10 border-l min-w-8 min-h-8">
          №{likeSortNum + 1}
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
    setOnCloseButtonFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
    setBottomLeftButtonProps,
    setTopLeftComponent,
    setConfirmButtonName,
    setCloseButtonName,
    setCloseButtonShow,
    setDeclineButtonShow,
    setTitle,
  }) => {
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const eventAtom = useMemo(
      () => unwrap(eventSelector(eventId), (prev) => prev),
      [eventId]
    )
    const userAtom = useMemo(
      () => unwrap(userSelector(userId), (prev) => prev),
      [userId]
    )
    const eventUsersAtom = useMemo(
      () => unwrap(eventsUsersFullByEventIdSelector(eventId), (prev) => prev ?? []),
      [eventId]
    )
    const participantsWithoutRelationshipAtom = useMemo(
      () =>
        unwrap(
          eventParticipantsFullWithoutRelationshipByEventIdSelector(eventId),
          (prev) => prev ?? []
        ),
      [eventId]
    )
    const event = useAtomValue(eventAtom)
    const user = useAtomValue(userAtom)
    const eventUsers = useAtomValue(eventUsersAtom) ?? []
    const eventUser = useMemo(
      () => eventUsers.find((eventUser) => eventUser.userId === userId),
      [eventUsers]
    )

    const [likes, setLikes] = useState(eventUser?.likes ?? [])
    const isModalButtonsConfiguredRef = useRef(false)
    const lastCloseButtonNameRef = useRef(null)
    const lastTitleRef = useRef(null)
    const initializedEventUserIdRef = useRef(null)
    const likesRef = useRef(likes)
    const isLikesProcessActiveRef = useRef(event?.likesProcessActive)
    const eventUserLikesRef = useRef(eventUser?.likes)

    const participantsWithoutRelationship =
      useAtomValue(participantsWithoutRelationshipAtom) ?? []

    const setEventUserData = useAtomValue(itemsFuncAtom).eventsUser.setData
    const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)

    useEffect(() => {
      likesRef.current = likes
    }, [likes])

    useEffect(() => {
      isLikesProcessActiveRef.current = event?.likesProcessActive
      eventUserLikesRef.current = eventUser?.likes
    }, [event?.likesProcessActive, eventUser?.likes])

    useEffect(() => {
      if (!eventUser?._id) return
      if (initializedEventUserIdRef.current === eventUser._id) return
      initializedEventUserIdRef.current = eventUser._id

      const initialLikes = eventUser?.likes ?? []
      likesRef.current = initialLikes
      setLikes(initialLikes)
    }, [eventUser?._id, eventUser?.likes])

    const saveLikes = useCallback(
      async (likesValue) => {
        if (!eventUser?._id) return
        return await setEventUserData(
          eventId,
          {
            likes: {
              [eventUser._id]: likesValue,
            },
          },
          true,
          true
        )
      },
      [eventId, eventUser?._id, setEventUserData]
    )

    const toggleLike = useCallback(
      async (targetUserId) => {
        const currentLikes = likesRef.current ?? []
        const nextLikes = currentLikes.includes(targetUserId)
          ? currentLikes.filter((id) => id !== targetUserId)
          : [...currentLikes, targetUserId]

        likesRef.current = nextLikes
        setLikes(nextLikes)
        await saveLikes(nextLikes)
      },
      [saveLikes]
    )

    const onCloseButtonClick = useCallback(async () => {
      if (
        isLikesProcessActiveRef.current &&
        (!likesRef.current || likesRef.current.length === 0) &&
        eventUserLikesRef.current === null
      ) {
        await saveLikes([])
      }

      closeModal()
    }, [closeModal, saveLikes])

    useEffect(() => {
      if (
        eventUser?._id &&
        !adminView &&
        !event?.likesProcessActive &&
        !eventUser?.seeLikesResult
      ) {
        setTimeout(() => {
          setEventUserData(
            eventId,
            {
              seeLikesResult: {
                [eventUser._id]: true,
              },
            },
            true,
            true
          )
        }, 500)
      }
    }, [eventUser?.seeLikesResult, event?.likesProcessActive, adminView])

    // const onClickConfirm = () => {
    //   setEventUserData(
    //     eventId,
    //     {
    //       likes: {
    //         [eventUser._id]: likes,
    //       },
    //     },
    //     true
    //   )
    //   closeModal()
    // }

    useEffect(() => {
      if (isModalButtonsConfiguredRef.current) return
      isModalButtonsConfiguredRef.current = true

      setOnConfirmFunc(undefined)
      setOnDeclineFunc(undefined)
      setOnCloseButtonFunc(onCloseButtonClick)
      setDeclineButtonShow(false)
      setCloseButtonShow(true)
      setConfirmButtonName('Закрыть')
    }, [
      onCloseButtonClick,
      setCloseButtonShow,
      setConfirmButtonName,
      setDeclineButtonShow,
      setOnConfirmFunc,
      setOnDeclineFunc,
      setOnCloseButtonFunc,
    ])

    useEffect(() => {
      const genderSuffix = user?.gender === 'male' ? '' : 'а'
      const nextCloseButtonName =
        event?.likesProcessActive && (!likes || likes.length === 0)
          ? `Решил${genderSuffix} никому не ставить лайк`
          : 'Закрыть'

      if (lastCloseButtonNameRef.current === nextCloseButtonName) return
      lastCloseButtonNameRef.current = nextCloseButtonName
      setCloseButtonName(nextCloseButtonName)
    }, [event?.likesProcessActive, likes, setCloseButtonName, user?.gender])

    useEffect(() => {
      if (!event?.likesProcessActive) {
        const nextTitle = `Совпадения лайков с участни${user?.gender === 'male' ? 'ц' : 'к'}ами`

        if (lastTitleRef.current === nextTitle) return
        lastTitleRef.current = nextTitle
        setTitle(nextTitle)
      }
    }, [event?.likesProcessActive, setTitle, user?.gender])

    if (!event || !user) {
      return <div className="py-4 text-center text-gray-500">Загрузка...</div>
    }

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

    const sortedOtherGenderEventUsers =
      !event.likesNumSort ||
      otherGenderEventUsers.find(
        ({ likeSortNum }) => typeof likeSortNum !== 'number'
      )
        ? otherGenderEventUsers
        : [...otherGenderEventUsers].sort((a, b) =>
            a.likeSortNum > b.likeSortNum ? 1 : -1
          )

    const NoteComponent = (props) => (adminView ? null : <Note {...props} />)

    const eventUsersOtherGenderWithCoincidences =
      sortedOtherGenderEventUsers.map((eventUser2) => ({
        ...eventUser2,
        likeToMe: eventUser2.likes?.includes(eventUser?.userId),
        iLike: eventUser?.likes?.includes(eventUser2.userId),
      }))

    const coincidences = eventUsersOtherGenderWithCoincidences.filter(
      (eventUser) => eventUser?.likeToMe && eventUser?.iLike
    )
    const notCoincidences = eventUsersOtherGenderWithCoincidences.filter(
      (eventUser) => !eventUser?.likeToMe && eventUser?.iLike
    )
    const other = eventUsersOtherGenderWithCoincidences.filter(
      (eventUser) => !eventUser?.iLike
    )

    return (
      <div className="flex flex-col">
        <div className="text-lg font-bold leading-4 text-center text-general">
          {event.title}
        </div>
        <DateTimeEvent
          wrapperClassName="my-2  text-base laptop:text-lg font-bold justify-center"
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
            {sortedOtherGenderEventUsers.map(({ user, likeSortNum }) => {
              const checked = likes.includes(user._id)

              return (
                <div
                  key={'like' + user._id}
                  className="flex items-center pl-1 overflow-hidden border border-gray-500 rounded-sm gap-x-1"
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 min-w-8 min-h-8',
                      event.likesProcessActive ? 'cursor-pointer group' : ''
                    )}
                    onClick={
                      event.likesProcessActive
                        ? () => toggleLike(user._id)
                        : undefined
                    }
                  >
                    <FontAwesomeIcon
                      className={cn(
                        'duration-300',
                        checked
                          ? 'w-9 h-9 min-h-9 min-w-9'
                          : 'w-7 h-7 min-h-7 min-w-7 group-hover:scale-110'
                      )}
                      icon={faHeart}
                      color={checked ? '#EC4899' : '#9ca3af'}
                    />
                  </div>
                  {event.likesNumSort && typeof likeSortNum === 'number' && (
                    <div className="flex items-center justify-center w-10 h-10 border-l min-w-8 min-h-8">
                      №{likeSortNum + 1}
                    </div>
                  )}
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
                {coincidences.map(({ user, iLike, likeToMe, likeSortNum }) => (
                  <CoincidenceItem
                    key={'coincidence' + user._id}
                    user={user}
                    coincidence={likeToMe && iLike}
                    like={iLike}
                    likeSortNum={
                      event.likesNumSort && typeof likeSortNum === 'number'
                        ? likeSortNum
                        : undefined
                    }
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
                {notCoincidences.map(
                  ({ user, iLike, likeToMe, likeSortNum }) => (
                    <CoincidenceItem
                      key={'noCoincidence' + user._id}
                      user={user}
                      coincidence={likeToMe && iLike}
                      like={iLike}
                      likeSortNum={
                        event.likesNumSort && typeof likeSortNum === 'number'
                          ? likeSortNum
                          : undefined
                      }
                    />
                  )
                )}
              </>
            ) : (
              <NoteComponent>
                {eventUser?.likes?.length === 1
                  ? 'Вы поставили всего один лайк и он совпал! Судьба?'
                  : 'Очень здорово, что все поставленные Вами симпатии (лайки) оказались взаимными! Вероятно вы очень хорошо чувствуете людей и это взаимно!'}
              </NoteComponent>
            )}
            {other.length > 0 ? (
              <>
                <div className="flex items-center justify-center px-3 mt-3 text-xl font-bold text-center text-gray-700">
                  ВЫ НЕ ПОСТАВИЛИ ЛАЙК
                </div>
                {other.map(({ user, iLike, likeToMe, likeSortNum }) => (
                  <CoincidenceItem
                    key={'noLikes' + user._id}
                    user={user}
                    coincidence={likeToMe && iLike}
                    like={iLike}
                    likeSortNum={
                      event.likesNumSort && typeof likeSortNum === 'number'
                        ? likeSortNum
                        : undefined
                    }
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
    declineButtonName: 'Закрыть',
    declineButtonBgClassName: 'bg-general',
    declineButtonShow: false,
    closeButtonShow: false,
    Children: LikeEditModal,
  }
}

export default likeEditFunc
