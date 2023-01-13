import React from 'react'

// import { useWindowDimensionsTailwindNum } from '@helpers/useWindowDimensions'
import UserCard from '@layouts/cards/UserCard'
import ListWrapper from './ListWrapper'
import { useRecoilValue } from 'recoil'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'

const UsersList = ({ users }) => {
  // const widthNum = useWindowDimensionsTailwindNum()
  const widthNum = useRecoilValue(windowDimensionsNumSelector)
  return (
    <ListWrapper itemCount={users.length} itemSize={widthNum > 2 ? 90 : 97}>
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
