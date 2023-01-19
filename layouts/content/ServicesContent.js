import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import servicesAtom from '@state/atoms/servicesAtom'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import ContentHeader from '@components/ContentHeader'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import ServiceCard from '@layouts/cards/ServiceCard'
import { getNounServices } from '@helpers/getNoun'
import AddButton from '@components/IconToggleButtons/AddButton'

const ServicesContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const services = useRecoilValue(servicesAtom)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounServices(services?.length)}
          </div>
          {isLoggedUserAdmin && (
            <AddButton onClick={() => modalsFunc.service.edit()} />
          )}
        </div>
      </ContentHeader>
      <CardListWrapper>
        {services?.length > 0 ? (
          [...services]
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
