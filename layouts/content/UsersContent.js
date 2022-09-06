import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import Fab from '@components/Fab'
import usersAtom from '@state/atoms/usersAtom'
import UserCard from '@layouts/cards/UserCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'

const UsersContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const users = useRecoilValue(usersAtom)

  return (
    <CardListWrapper>
      {users?.length > 0 ? (
        users.map((user) => <UserCard key={user._id} userId={user._id} />)
      ) : (
        <div className="flex justify-center p-2">Нет пользователей</div>
      )}
      <Fab onClick={() => modalsFunc.user.edit()} show />
    </CardListWrapper>
  )
}

export default UsersContent
