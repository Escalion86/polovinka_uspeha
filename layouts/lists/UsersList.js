// import UserCard from '@layouts/cards/UserCard'
import dynamic from 'next/dynamic'
const UserCard = dynamic(() => import('@layouts/cards/UserCard'))
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import { useAtomValue } from 'jotai'
import ListWrapper from './ListWrapper'

const UsersList = ({ users }) => {
  const widthNum = useAtomValue(windowDimensionsNumSelector)
  return (
    <ListWrapper
      itemCount={users.length}
      itemSize={widthNum > 2 ? 120 : 148}
      wrapperClassName="bg-general/15"
      className="p-2"
    >
      {({ index, style }) => (
        <UserCard
          style={style}
          key={users[index]._id}
          userId={users[index]._id}
          user={users[index]}
        />
      )}
    </ListWrapper>
  )
}

export default UsersList
