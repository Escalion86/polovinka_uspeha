import UserCardButtons from '@components/cardButtons/UserCardButtons'
import CardWrapper from '@components/CardWrapper'
import TextLinesLimiter from '@components/TextLinesLimiter'
import UserName from '@components/UserName'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import UserStatusIcon from '@components/UserStatusIcon'
import ZodiacIcon from '@components/ZodiacIcon'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'
import { faGenderless } from '@fortawesome/free-solid-svg-icons/faGenderless'
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons/faVolumeHigh'
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons/faVolumeMute'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import birthDateToAge from '@helpers/birthDateToAge'
import { GENDERS } from '@helpers/constants'
import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import eventsUsersSignedUpWithEventStatusByUserIdCountSelector from '@state/selectors/eventsUsersSignedUpWithEventStatusByUserIdCountSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import sumOfPaymentsWithoutEventIdByUserIdSelector from '@state/selectors/sumOfPaymentsWithoutEventIdByUserIdSelector'
import userCutedSelector from '@state/selectors/userCutedSelector'
import cn from 'classnames'
// import { Suspense } from 'react'
// import Skeleton from 'react-loading-skeleton'
import { useAtomValue } from 'jotai'
import { Suspense } from 'react'
import UserCardSkeleton from './Skeletons/UserCardSkeleton'
import Image from 'next/image'

const UserSumOfPaymentsWithoutEvent = ({ userId, className }) => {
  const sumOfPaymentsWithoutEventOfUser = useAtomValue(
    sumOfPaymentsWithoutEventIdByUserIdSelector(userId)
  )

  if (sumOfPaymentsWithoutEventOfUser === 0) return null

  return (
    <div
      className={cn(
        'flex justify-center items-center text-base tablet:text-lg font-bold uppercase text-white px-3 rounded-tl-lg',
        sumOfPaymentsWithoutEventOfUser > 0 ? 'bg-success' : 'bg-danger',
        className
      )}
    >
      {`${sumOfPaymentsWithoutEventOfUser} ₽`}
    </div>
  )
}

// const SignedUpCountComponent = ({ userId }) => {
//   const eventsUsersSignedUpCount = useAtomValue(
//     eventsUsersSignedUpWithEventStatusByUserIdCountSelector(userId)
//   )
//   return <span className="font-normal">{eventsUsersSignedUpCount.signUp}</span>
// }

// const FinishedComponent = ({ userId }) => {
//   const eventsUsersSignedUpCount = useAtomValue(
//     eventsUsersSignedUpWithEventStatusByUserIdCountSelector(userId)
//   )
//   return (
//     <span className="font-normal">{eventsUsersSignedUpCount.finished}</span>
//   )
// }

// const SignedUpCount = (props) => (
//   <Suspense fallback={<Skeleton className="w-[8px] h-4 " />}>
//     <SignedUpCountComponent {...props} />
//   </Suspense>
// )

// const FinishedCount = (props) => (
//   <Suspense fallback={<Skeleton className="w-[8px] h-4 " />}>
//     <FinishedComponent {...props} />
//   </Suspense>
// )

const UserActiveSignedUpBadge = ({ userId }) => {
  const eventsUsersSignedUpCount = useAtomValue(
    eventsUsersSignedUpWithEventStatusByUserIdCountSelector(userId)
  )
  const activeSignedUpCount = eventsUsersSignedUpCount?.signUp

  if (typeof activeSignedUpCount !== 'number' || activeSignedUpCount <= 0)
    return null

  return (
    <span className="inline-flex items-center rounded-full border border-[#f0e5ea] bg-white/80 px-2 py-0.5 text-[10px] tablet:text-[12px] uppercase font-semibold tracking-[0.1em] text-[#1f6e9c]">
      {activeSignedUpCount}
      <span className="ml-1 opacity-70">Записан</span>
    </span>
  )
}

const UserCard = ({ userId, user: userProp, hidden = false, style }) => {
  const serverDate = new Date(useAtomValue(serverSettingsAtom)?.dateTime)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const user = userProp ?? useAtomValue(userCutedSelector(userId))
  const loading = useAtomValue(loadingAtom('user' + userId))
  // const eventUsers = useAtomValue(eventsUsersSignedUpByUserIdSelector(userId))
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)

  const seeBirthday = loggedUserActiveRole?.users?.seeBirthday
  const seeNotificationIcon =
    loggedUserActiveRole?.users?.seeNotificationIconOnCard
  const seeSumOfPaymentsWithoutEventOnCard =
    loggedUserActiveRole?.seeSumOfPaymentsWithoutEventOnCard
  // const widthNum = useWindowDimensionsTailwindNum()
  // const itemFunc = useAtomValue(itemsFuncAtom)
  const resolvedUserId = user?._id ?? userId

  const userGender =
    user?.gender && GENDERS.find((gender) => gender.value === user?.gender)
  const rawAvatarSrc = getUserAvatarSrc(user)
  const normalizeAvatarSrc = (value) => {
    if (typeof value !== 'string') return '/img/users/null.jpg'
    const trimmed = value.trim()
    if (!trimmed) return '/img/users/null.jpg'
    if (
      trimmed.startsWith('/') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('//')
    )
      return trimmed
    return '/img/users/null.jpg'
  }
  const avatarSrc = normalizeAvatarSrc(rawAvatarSrc)

  // const userStatusArr = USERS_STATUSES.find(
  //   (userStatus) => userStatus.value === user.status
  // )

  return (
    <CardWrapper
      loading={loading}
      onClick={user ? () => modalsFunc.user.view(user._id) : undefined}
      hidden={hidden}
      style={style}
      className="rounded-[22px] border border-[rgba(107,31,42,0.16)] shadow-[0_16px_30px_rgba(0,0,0,0.1)]"
      bgClassName="bg-white/95"
      outerClassName="px-3 py-2"
    >
      <div className="flex w-full">
        <div
          className={cn(
            'w-8 flex justify-center items-center rounded-l-[22px]',
            userGender ? 'bg-' + userGender.color : 'bg-gray-400'
          )}
        >
          <FontAwesomeIcon
            className="w-8 h-8 text-white min-h-6"
            icon={userGender ? userGender.icon : faGenderless}
          />
        </div>
        <div className="flex flex-col flex-1 tablet:flex-row">
          <div className="flex flex-1 border-b tablet:border-b-0">
            <Image
              className="hidden object-cover tablet:block w-[92px] h-[92px] min-w-[92px] min-h-[92px] rounded-[16px] border border-[#f0e5ea] bg-white/80 m-2"
              src={avatarSrc}
              alt="Аватар пользователя"
              width={92}
              height={92}
              sizes="(max-width: 1023px) 92px, 92px"
            />
            <div className="flex flex-col flex-1 text-xl font-bold">
              <div className="flex flex-1">
                <div className="flex flex-col flex-1">
                  <div className="tablet:rounded-bl-[30px] flex min-h-13 h-13 pl-3 max-h-13 flex-nowrap items-center px-2 py-0.5 leading-6 gap-x-2 rounded-tr-[22px] bg-[linear-gradient(135deg,rgba(107,31,42,0.08),rgba(79,176,232,0.12))]">
                    <div className="flex items-center flex-1 h-7 max-h-7 flex-nowrap">
                      <UserRelationshipIcon
                        relationship={user?.relationship}
                        showHavePartnerOnly
                      />
                      {user?.status === 'member' ? (
                        <UserStatusIcon status={user?.status} size="m" />
                      ) : null}
                      <UserName
                        user={user}
                        className="h-8 text-base font-bold tablet:text-lg -mt-0.5 tablet:mt-0"
                        // noWrap
                      />
                    </div>
                    {/* <span>{user.firstName}</span>
                    {user.secondName && <span>{user.secondName}</span>} */}
                    {/* {user.birthday && (
                      <div className="flex items-center font-normal whitespace-nowrap gap-x-2">
                        <span>{birthDateToAge(user.birthday)}</span>
                        <ZodiacIcon date={user.birthday} />
                      </div>
                    )} */}
                    {/* {user.role === 'admin' && (
                      <span className="font-normal text-red-400">
                        АДМИНИСТРАТОР
                      </span>
                    )} */}
                    <UserCardButtons item={user} />
                  </div>
                  <div className="flex tablet:h-full">
                    <img
                      className="object-cover w-[60px] h-[60px] min-w-[60px] min-h-[60px] tablet:hidden rounded-[12px] border border-[#f0e5ea] bg-white/80 m-2"
                      src={avatarSrc}
                      alt="user"
                      // width={48}
                      // height={48}
                    />
                    <div className="flex flex-col justify-end h-full pb-1 mt-1 tablet:px-2">
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                        {user?.birthday &&
                          (seeBirthday ||
                            user?.security?.showBirthday === true ||
                            user?.security?.showBirthday === 'full') && (
                            <span className="inline-flex items-center rounded-full border border-[#f0e5ea] bg-white/80 px-2 py-0.5 text-[10px] tablet:text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6b1f2a]">
                              {birthDateToAge(
                                user?.birthday,
                                serverDate,
                                true,
                                false,
                                true
                              )}
                              <span className="ml-1.5 flex items-center text-[#6b1f2a]">
                                <span className="scale-90 tablet:hidden">
                                  <ZodiacIcon date={user?.birthday} small />
                                </span>
                                <span className="hidden tablet:inline-block">
                                  <ZodiacIcon date={user?.birthday} small />
                                </span>
                              </span>
                            </span>
                          )}
                        {typeof user?.signedUpEventsCount === 'number' && (
                          <span className="inline-flex items-center rounded-full border border-[#f0e5ea] bg-white/80 px-2 py-0.5 text-[10px] tablet:text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1f6e9c]">
                            {user?.signedUpEventsCount}
                            <span className="ml-1 opacity-70">событий</span>
                          </span>
                        )}
                        {resolvedUserId && (
                          <Suspense
                            fallback={
                              <div className="w-20 h-5 bg-gray-200 rounded-full" />
                            }
                          >
                            <UserActiveSignedUpBadge userId={resolvedUserId} />
                          </Suspense>
                        )}
                      </div>
                      <div className="flex items-center flex-1">
                        <TextLinesLimiter
                          className="text-sm italic font-normal leading-3.5 text-general"
                          // textClassName="leading-5"
                          lines={2}
                          textCenter={false}
                        >
                          {user.personalStatus}
                        </TextLinesLimiter>
                      </div>
                      {user?.birthday &&
                        (seeBirthday ||
                          user?.security?.showBirthday === true ||
                          user?.security?.showBirthday === 'full') &&
                        null}
                    </div>
                    <div className="flex items-end justify-end flex-1 py-2 pr-3 gap-x-1">
                      {seeNotificationIcon && (
                        <div className="absolute flex items-center justify-end bottom-2 right-3 gap-x-1">
                          {!user?.notifications?.telegram?.active ? (
                            //  && !user.notifications?.whatsapp?.active
                            <FontAwesomeIcon
                              // className={cn(
                              //   'h-3',
                              //   user.notifications?.telegram?.active &&
                              //     user.notifications?.telegram?.id
                              //     ? 'text-success'
                              //     : 'text-gray-800'
                              // )}
                              className="h-3 text-gray-800"
                              // icon={
                              //   user.notifications?.telegram?.active &&
                              //   user.notifications?.telegram?.id
                              //     ? faVolumeHigh
                              //     : faVolumeMute
                              // }
                              icon={faVolumeMute}
                              size="xs"
                            />
                          ) : (
                            <FontAwesomeIcon
                              // className={cn(
                              //   'h-3',
                              //   user.notifications?.telegram?.active &&
                              //     user.notifications?.telegram?.id
                              //     ? 'text-success'
                              //     : 'text-gray-800'
                              // )}
                              className="h-3 text-success"
                              // icon={
                              //   user.notifications?.telegram?.active &&
                              //   user.notifications?.telegram?.id
                              //     ? faVolumeHigh
                              //     : faVolumeMute
                              // }
                              icon={faVolumeHigh}
                              size="xs"
                            />
                          )}
                          {user?.notifications?.telegram?.active && (
                            <FontAwesomeIcon
                              className="h-5 text-blue-600"
                              icon={faTelegram}
                              size="xs"
                            />
                          )}
                          {/* {user.notifications?.whatsapp?.active && (
                            <FontAwesomeIcon
                              className="h-5 text-green-600"
                              icon={faWhatsapp}
                              size="xs"
                            />
                          )} */}
                        </div>
                      )}
                      {seeSumOfPaymentsWithoutEventOnCard && (
                        <Suspense
                          fallback={
                            <div className="w-16 h-5 bg-gray-200 rounded-full" />
                          }
                        >
                          <UserSumOfPaymentsWithoutEvent userId={userId} />
                        </Suspense>
                      )}
                    </div>
                  </div>
                </div>
                {/* <div className="flex flex-col items-end justify-between">
                  <UserCardButtons item={user} />
                  {seeSumOfPaymentsWithoutEventOnCard && (
                    <UserSumOfPaymentsWithoutEvent userId={userId} />
                  )}
                </div> */}
              </div>
              {/* <div className="flex-col justify-end flex-1 hidden px-2 tablet:flex"> */}
              {/* <div className="flex-1"> */}
              {/* {user.about && (
                <div>
                  <span className="font-bold">Обо мне:</span>
                  <span>{user.about}</span>
                </div>
              )}
              {user.profession && (
                <div>
                  <span className="font-bold">Профессия:</span>
                  <span>{user.profession}</span>
                </div>
              )}
              {user.interests && (
                <div>
                  <span className="font-bold">Интересы:</span>
                  <span>{user.interests}</span>
                </div>
              )} */}
              {/* </div> */}
              {/* <ContactsIconsButtons
                className="hidden px-2 tablet:flex"
                user={user}
              /> */}
              {/* </div> */}
            </div>
          </div>
          {/* <ContactsIconsButtons className="px-2 tablet:hidden" user={user} /> */}
        </div>
      </div>
    </CardWrapper>
  )
}

const UserCardWrapper = (props) => (
  <Suspense fallback={<UserCardSkeleton {...props} />}>
    <UserCard {...props} />
  </Suspense>
)

export default UserCardWrapper
