import React from 'react'

import EventCard from '@layouts/cards/EventCard'
import ListWrapper from './ListWrapper'
import { useRecoilValue } from 'recoil'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import ServiceUserCard from '@layouts/cards/ServiceUserCard'

const ServicesUsersList = ({ servicesUsers }) => {
  // const widthNum = useRecoilValue(windowDimensionsNumSelector)
  return (
    <ListWrapper
      itemCount={servicesUsers.length}
      itemSize={82}
      className="bg-opacity-15 bg-general"
    >
      {({ index, style }) => (
        <ServiceUserCard
          style={style}
          key={servicesUsers[index]._id}
          serviceUserId={servicesUsers[index]._id}
        />
      )}
    </ListWrapper>
  )
}

export default ServicesUsersList
