import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import CardButtons from '@components/CardButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import getZodiac from '@helpers/getZodiac'
import { GENDERS, USERS_STATUSES } from '@helpers/constants'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGenderless } from '@fortawesome/free-solid-svg-icons'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import userSelector from '@state/selectors/userSelector'
import loadingAtom from '@state/atoms/loadingAtom'
import { CardWrapper } from '@components/CardWrapper'
import Image from 'next/image'
import Tooltip from '../../components/Tooltip'
import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import Divider from '@components/Divider'

const UserCard = ({ userId }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const user = useRecoilValue(userSelector(userId))
  const loading = useRecoilValue(loadingAtom('user' + userId))
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
              className="object-cover w-20 h-20 tablet:w-24 tablet:h-24"
              src={getUserAvatarSrc(user)}
              alt="user"
              // width={48}
              // height={48}
            />
            <div className="flex flex-col flex-1 text-xl font-bold">
              <div className="flex flex-1">
                <div className="flex flex-col flex-1">
                  <div className="flex flex-wrap items-center px-2 py-1 leading-6 gap-x-1">
                    {user.status === 'member' && (
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
                    {user.status === 'ban' && (
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
                    <span>{user.firstName}</span>
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
                    {user.role === 'admin' && (
                      <span className="font-normal text-red-400">
                        АДМИНИСТРАТОР
                      </span>
                    )}
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
