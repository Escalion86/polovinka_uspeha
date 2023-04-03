import React from 'react'

import ListWrapper from './ListWrapper'
import ServiceUserCard from '@layouts/cards/ServiceUserCard'

const ServicesUsersList = ({ servicesUsers, showUser = true }) => {
  return (
    <ListWrapper
      itemCount={servicesUsers.length}
      itemSize={showUser ? 123 : 82}
      className="bg-opacity-15 bg-general"
    >
      {({ index, style }) => (
        <ServiceUserCard
          style={style}
          key={servicesUsers[index]._id}
          serviceUserId={servicesUsers[index]._id}
          showUser={showUser}
        />
      )}
    </ListWrapper>
  )
}

export default ServicesUsersList
