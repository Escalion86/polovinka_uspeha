import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import getNoun from '@helpers/getNoun'
import Fab from '@components/Fab'
import CardButtons from '@components/CardButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import getZodiac from '@helpers/getZodiac'
import { GENDERS, USERS_STATUSES } from '@helpers/constants'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGenderless } from '@fortawesome/free-solid-svg-icons'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import usersAtom from '@state/atoms/usersAtom'
import userSelector from '@state/selectors/userSelector'
import loadingAtom from '@state/atoms/loadingAtom'
import { CardWrapper } from '@components/CardWrapper'
import Image from 'next/image'
import Tooltip from '../../components/Tooltip'

const UserCard = ({ userId }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const user = useRecoilValue(userSelector(userId))
  const loading = useRecoilValue(loadingAtom('user' + userId))
  // const itemFunc = useRecoilValue(itemsFuncAtom)

  const userGender =
    user.gender && GENDERS.find((gender) => gender.value === user.gender)

  const userStatusArr = USERS_STATUSES.find(
    (userStatus) => userStatus.value === user.status
  )

  return (
    <CardWrapper
      loading={loading}
      onClick={() => modalsFunc.user.view(user._id)}
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
        <img
          className="object-cover w-20 h-20 tablet:w-24 tablet:h-24"
          src={user.image}
          alt="user"
          // width={48}
          // height={48}
        />
        <div className="flex flex-col flex-1 text-xl font-bold">
          <div className="flex">
            <div className="flex flex-wrap flex-1 px-2 gap-x-1 items-center">
              {userStatusArr?.value === 'member' && (
                <Tooltip content="Участник клуба">
                  <div className="w-6 h-6">
                    <Image
                      src="/img/svg_icons/medal.svg"
                      width="24"
                      height="24"
                    />
                  </div>
                </Tooltip>
              )}
              {userStatusArr?.value === 'ban' && (
                <Tooltip content="Забанен">
                  <div className="w-6 h-6">
                    <Image
                      src="/img/svg_icons/ban.svg"
                      width="24"
                      height="24"
                    />
                  </div>
                </Tooltip>
              )}
              <span>{user.name}</span>
              {user.secondName && <span>{user.secondName}</span>}
              {user.birthday && (
                <div className="font-normal whitespace-nowrap">
                  {user.birthday
                    ? birthDateToAge(user.birthday) +
                      ', ' +
                      getZodiac(user.birthday).name
                    : ''}
                </div>
              )}
              {/* {userStatusArr && userStatusArr.value !== 'novice' && (
                <span
                  className={cn(
                    'font-normal uppercase',
                    'text-' + userStatusArr.color
                  )}
                >
                  {userStatusArr.name}
                </span>
              )} */}
              {user.role === 'admin' && (
                <span className="font-normal text-red-400">АДМИНИСТРАТОР</span>
              )}
            </div>
            <CardButtons item={user} typeOfItem="user" />
          </div>
          <div className="flex flex-col justify-between flex-1 px-2 text-sm font-normal">
            <div className="flex-1">
              {user.about && (
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
              )}
            </div>
            <ContactsIconsButtons user={user} />
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

const UsersContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const users = useRecoilValue(usersAtom)

  return (
    <>
      {users?.length > 0 ? (
        users.map((user) => <UserCard key={user._id} userId={user._id} />)
      ) : (
        <div className="flex justify-center p-2">Нет пользователей</div>
      )}
      <Fab onClick={() => modalsFunc.user.edit()} show />
    </>
  )
}

export default UsersContent
