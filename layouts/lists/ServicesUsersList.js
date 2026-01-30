// import ServiceUserCard from '@layouts/cards/ServiceUserCard'
import dynamic from 'next/dynamic'
const ServiceUserCard = dynamic(() => import('@layouts/cards/ServiceUserCard'))
import ListWrapper from './ListWrapper'

const ServicesUsersList = ({ servicesUsers, showUser = true }) => {
  return (
    <ListWrapper
      itemCount={servicesUsers.length}
      itemSize={showUser ? 123 : 82}
      className="bg-general/15"
      itemKey={(index) => servicesUsers[index]?._id ?? index}
    >
      {({ index, style }) => (
        <ServiceUserCard
          style={style}
          key={servicesUsers[index]._id}
          serviceUser={servicesUsers[index]}
          showUser={showUser}
        />
      )}
    </ListWrapper>
  )
}

export default ServicesUsersList
