import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import CardButtons from '@components/CardButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import { GENDERS } from '@helpers/constants'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGenderless, faUser } from '@fortawesome/free-solid-svg-icons'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import userSelector from '@state/selectors/userSelector'
import loadingAtom from '@state/atoms/loadingAtom'
import { CardWrapper } from '@components/CardWrapper'
import Image from 'next/image'
import Tooltip from '@components/Tooltip'
import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import ZodiacIcon from '@components/ZodiacIcon'
import UserStatusIcon from '@components/UserStatusIcon'
import eventsUsersVisitedByUserIdSelector from '@state/selectors/eventsUsersVisitedByUserIdSelector'
import formatDate from '@helpers/formatDate'

const UserCard = ({ userId, hidden = false }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const user = useRecoilValue(userSelector(userId))
  const loading = useRecoilValue(loadingAtom('user' + userId))
  const eventUsers = useRecoilValue(eventsUsersVisitedByUserIdSelector(userId))
  // const itemFunc = useRecoilValue(itemsFuncAtom)

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
              className="object-cover w-16 h-16 min-w-16 min-h-16 tablet:w-24 tablet:h-24 tablet:min-w-24 tablet:min-h-24"
              src={getUserAvatarSrc(user)}
              alt="user"
              // width={48}
              // height={48}
            />
            <div className="flex flex-col flex-1 text-xl font-bold">
              <div className="flex flex-1">
                <div className="flex flex-col flex-1 px-2 py-1">
                  <div className="flex flex-wrap items-center leading-6 gap-x-1">
                    <UserStatusIcon status={user.status} />
                    <span>{user.firstName}</span>
                    {user.secondName && <span>{user.secondName}</span>}
                    {user.birthday && (
                      <div className="flex items-center font-normal whitespace-nowrap gap-x-2">
                        <span>{birthDateToAge(user.birthday)}</span>
                        <ZodiacIcon date={user.birthday} />
                      </div>
                    )}
                    {user.role === 'admin' && (
                      <span className="font-normal text-red-400">
                        АДМИНИСТРАТОР
                      </span>
                    )}
                  </div>
                  <div className="flex text-sm leading-4 gap-x-2 ">
                    <span className="font-bold">Дата регистрации:</span>
                    <span className="font-normal">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex text-sm leading-4 gap-x-2">
                    <span className="font-bold">Посетил мероприятий:</span>
                    <span className="font-normal">{eventUsers.length}</span>
                  </div>
                </div>
                <CardButtons item={user} typeOfItem="user" />
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
              <ContactsIconsButtons
                className="hidden px-2 tablet:flex"
                user={user}
              />
              {/* </div> */}
            </div>
          </div>
          <ContactsIconsButtons className="px-2 tablet:hidden" user={user} />
        </div>
      </div>
    </CardWrapper>
  )
}

export default UserCard
