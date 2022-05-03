import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import getNoun from '@helpers/getNoun'
import Fab from '@components/Fab'
import CardButtons from '@components/CardButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import getZodiac from '@helpers/getZodiac'
import { GENDERS } from '@helpers/constants'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGenderless } from '@fortawesome/free-solid-svg-icons'
import ContactsIconsButtons from '@components/ContactsIconsButtons'

const UsersContent = (props) => {
  const { users } = props
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  return (
    <>
      {users ? (
        users.map((user) => {
          const userGender =
            user.gender &&
            GENDERS.find((gender) => gender.value === user.gender)
          console.log('user.gender', user.gender)
          return (
            <div
              key={user._id}
              className="duration-300 bg-white border-t border-b border-gray-400 shadow-sm cursor-pointer hover:shadow-medium-active"
              onClick={() => modalsFunc.user.edit(user)}
            >
              <div className="flex">
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
                    <div className="flex flex-wrap flex-1 px-2 gap-x-2">
                      {user.name}
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
                    <CardButtons item={user} typeOfItem="user" />
                  </div>
                  <div className="flex flex-col justify-between flex-1 px-2 text-sm font-normal">
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
                    <ContactsIconsButtons user={user} />
                  </div>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="flex justify-center p-2">Нет пользователей</div>
      )}
      <Fab onClick={() => modalsFunc.user.edit()} show />
    </>
  )
}

export default UsersContent
