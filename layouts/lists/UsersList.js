import React from 'react'

import { useWindowDimensionsTailwindNum } from '@helpers/useWindowDimensions'
import UserCard from '@layouts/cards/UserCard'
import ListWrapper from './ListWrapper'

const UsersList = ({ users }) => {
  const windowWidthNum = useWindowDimensionsTailwindNum()
  return (
    <ListWrapper
      itemCount={users.length}
      itemSize={windowWidthNum > 2 ? 90 : 97}
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
