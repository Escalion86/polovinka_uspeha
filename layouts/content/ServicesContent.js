import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import { getNounServices } from '@helpers/getNoun'
import ServiceCard from '@layouts/cards/ServiceCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import { modalsFuncAtom } from '@state/atoms'
import servicesAtom from '@state/atoms/servicesAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useRecoilValue } from 'recoil'

const ServicesContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const services = useRecoilValue(servicesAtom)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const seeHidden = loggedUserActiveRole?.services?.seeHidden
  const addButton = loggedUserActiveRole?.services?.add

  const filteredServices = seeHidden
    ? services
    : services.filter(({ showOnSite }) => showOnSite)

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounServices(filteredServices?.length)}
          </div>
          {addButton && <AddButton onClick={() => modalsFunc.service.edit()} />}
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
