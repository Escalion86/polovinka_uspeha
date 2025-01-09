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
      itemSize={widthNum > 2 ? 98 : 101}
      className="bg-general/15"
    >
      {({ index, style }) => (
        <UserCard
          style={style}
          key={users[index]._id}
          userId={users[index]._id}
        />
      )}
    </ListWrapper>
  )
}

export default UsersList
