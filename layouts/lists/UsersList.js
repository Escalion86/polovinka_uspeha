import React from 'react'

import UserCard from '@layouts/cards/UserCard'
import ListWrapper from './ListWrapper'
import { useRecoilValue } from 'recoil'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'

const UsersList = ({ users }) => {
  const widthNum = useRecoilValue(windowDimensionsNumSelector)
  return (
    <ListWrapper
      itemCount={users.length}
      itemSize={widthNum > 2 ? 90 : 97}
      className="bg-opacity-15 bg-general"
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
