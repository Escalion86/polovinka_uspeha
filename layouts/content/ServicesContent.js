'use client'

import ContentHeader from '@components/ContentHeader'
import CityManagementBlockedBanner from '@components/CityManagementBlockedBanner'
import AddButton from '@components/IconToggleButtons/AddButton'
import { getNounServices } from '@helpers/getNoun'
import useCityManagementAccess from '@hooks/useCityManagementAccess'
import ServiceCard from '@layouts/cards/ServiceCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import modalsFuncAtom from '@state/modalsFuncAtom'
import servicesAtom from '@state/atoms/servicesAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useAtomValue } from 'jotai'

const ServicesContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const services = useAtomValue(servicesAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const seeHidden = loggedUserActiveRole?.services?.seeHidden
  const addButton = loggedUserActiveRole?.services?.add
  const { loading: cityAccessLoading, allowEventManagement, cityTitle } =
    useCityManagementAccess()

  const filteredServices = seeHidden
    ? services
    : services.filter(({ showOnSite }) => showOnSite)

  return (
    <>
      {!cityAccessLoading && !allowEventManagement ? (
        <CityManagementBlockedBanner cityTitle={cityTitle} />
      ) : null}
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounServices(filteredServices?.length)}
          </div>
          {addButton && allowEventManagement ? (
            <AddButton onClick={() => modalsFunc.service.edit()} />
          ) : null}
        </div>
      </ContentHeader>
      <CardListWrapper>
        {filteredServices?.length > 0 ? (
          [...filteredServices]
            .sort((a, b) => (a.index < b.index ? -1 : 1))
            .map((service) => (
              <ServiceCard key={service._id} serviceId={service._id} />
            ))
        ) : (
          <div className="flex justify-center p-2">Нет услуг</div>
        )}
      </CardListWrapper>
    </>
  )
}

export default ServicesContent
