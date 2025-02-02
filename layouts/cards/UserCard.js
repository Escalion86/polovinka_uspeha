import CardButtons from '@components/CardButtons'
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
// import eventsUsersSignedUpWithEventStatusByUserIdCountSelector from '@state/selectors/eventsUsersSignedUpWithEventStatusByUserIdCountSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import sumOfPaymentsWithoutEventIdByUserIdSelector from '@state/selectors/sumOfPaymentsWithoutEventIdByUserIdSelector'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
// import { Suspense } from 'react'
// import Skeleton from 'react-loading-skeleton'
import { useAtomValue } from 'jotai'

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
//   <Suspense fallback={<Skeleton className="w-[8px] h-[16px] " />}>
//     <SignedUpCountComponent {...props} />
//   </Suspense>
// )

// const FinishedCount = (props) => (
//   <Suspense fallback={<Skeleton className="w-[8px] h-[16px] " />}>
//     <FinishedComponent {...props} />
//   </Suspense>
// )

const UserCard = ({ userId, hidden = false, style }) => {
  const serverDate = new Date(useAtomValue(serverSettingsAtom)?.dateTime)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const user = useAtomValue(userSelector(userId))
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

  const userGender =
    user.gender && GENDERS.find((gender) => gender.value === user.gender)

  // const userStatusArr = USERS_STATUSES.find(
  //   (userStatus) => userStatus.value === user.status
  // )

  return (
    <CardWrapper
      loading={loading}
      onClick={() => modalsFunc.user.view(user._id)}
      hidden={hidden}
      style={style}
    >
      <div className="flex w-full">
        <div
          className={cn(
            'w-8 flex justify-center items-center',
            userGender ? 'bg-' + userGender.color : 'bg-gray-400'
          )}
        >
          <FontAwesomeIcon
            className="w-8 h-8 text-white"
            icon={userGender ? userGender.icon : faGenderless}
          />
        </div>
        <div className="flex flex-col flex-1 tablet:flex-row">
          <div className="flex flex-1 border-b tablet:border-b-0">
            <img
              className="hidden object-cover w-[92px] h-[92px] tablet:block min-w-[92px] min-h-[92px]"
              src={getUserAvatarSrc(user)}
              alt="user"
              // width={48}
              // height={48}
            />
            <div className="flex flex-col flex-1 text-xl font-bold">
              <div className="flex flex-1">
                <div className="flex flex-col flex-1">
                  <div className="flex h-8 max-h-8 flex-nowrap items-start pl-1 py-0.5 leading-6 gap-x-1">
                    <div className="flex items-center flex-1 h-7 max-h-7 flex-nowrap">
                      <UserRelationshipIcon
                        relationship={user.relationship}
                        showHavePartnerOnly
                      />
                      <UserStatusIcon status={user.status} size="m" />
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
                    <CardButtons item={user} typeOfItem="user" />
                  </div>
                  <div className="flex tablet:h-full">
                    <img
                      className="object-cover w-[60px] h-[60px] min-w-[60px] min-h-[60px] tablet:hidden"
                      src={getUserAvatarSrc(user)}
                      alt="user"
                      // width={48}
                      // height={48}
                    />
                    <div className="flex flex-col justify-end h-full px-1">
                      <div className="flex items-center flex-1">
                        <TextLinesLimiter
                          className="text-sm italic font-normal leading-[14px] text-general"
                          // textClassName="leading-5"
                          lines={2}
                          textCenter={false}
                        >
                          {user.personalStatus}
                        </TextLinesLimiter>
                      </div>
                      {user.birthday &&
                        (seeBirthday ||
                          user.security?.showBirthday === true ||
                          user.security?.showBirthday === 'full') && (
                          <div className="flex text-sm leading-4 gap-x-2 ">
                            <span className="flex items-center font-bold">
                              Возраст:
                            </span>
                            <div className="flex items-center text-sm font-normal whitespace-nowrap gap-x-2">
                              <span className="leading-4">
                                {birthDateToAge(
                                  user.birthday,
                                  serverDate,
                                  true,
                                  false,
                                  true
                                )}
                              </span>
                              <ZodiacIcon date={user.birthday} small />
                            </div>
                          </div>
                        )}

                      {/* <div className="flex text-sm leading-4 gap-x-2 ">
                        <span className="font-bold">Зарегистрирован:</span>
                        <span className="font-normal">
                          {formatDate(user.createdAt)}
                        </span>
                      </div> */}
                      {typeof user.signedUpEventsCount === 'number' && (
                        <div className="flex text-sm leading-4 gap-x-2">
                          <span className="font-bold">
                            Посетил мероприятий:
                          </span>
                          {/* <FinishedCount userId={userId} /> */}
                          <span className="font-normal">
                            {user.signedUpEventsCount}
                          </span>
                          {/* <span className="font-bold">Записан:</span> */}
                          {/* <SignedUpCount userId={userId} /> */}
                        </div>
                      )}
                    </div>
                    <div className="flex items-end justify-end flex-1 py-1 pr-1 gap-x-1">
                      {seeNotificationIcon && (
                        <div className="flex items-center justify-end gap-x-1">
                          <FontAwesomeIcon
                            className={cn(
                              'h-3',
                              user.notifications?.telegram?.active &&
                                user.notifications?.telegram?.id
                                ? 'text-success'
                                : 'text-gray-800'
                            )}
                            icon={
                              user.notifications?.telegram?.active &&
                              user.notifications?.telegram?.id
                                ? faVolumeHigh
                                : faVolumeMute
                            }
                            size="xs"
                          />
                          {user.notifications?.telegram?.id && (
                            <FontAwesomeIcon
                              className="h-5 text-blue-600"
                              icon={faTelegram}
                              size="xs"
                            />
                          )}
                        </div>
                      )}
                      {seeSumOfPaymentsWithoutEventOnCard && (
                        <UserSumOfPaymentsWithoutEvent userId={userId} />
                      )}
                    </div>
                  </div>
                </div>
                {/* <div className="flex flex-col items-end justify-between">
                  <CardButtons item={user} typeOfItem="user" />
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

export default UserCard
