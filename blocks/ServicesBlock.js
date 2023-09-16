import BlockContainer from '@components/BlockContainer'
import { useRecoilValue } from 'recoil'
import Masonry from '@components/Masonry'
import Button from '@components/Button'
import eventsAtom from '@state/atoms/eventsAtom'
import { modalsFuncAtom } from '@state/atoms'
import filteredServicesSelector from '@state/selectors/filteredServicesSelector'

const ServiceItem = ({ serviceId, title, shortDescription, images }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  return (
    <div className="flex-col max-w-[430px] overflow-hidden bg-white rounded-lg shadow-xl gap-y-1">
      {images && (
        <img
          className="object-cover w-full max-h-[220px]"
          src={images[0]}
          alt="service"
          // width={48}
          // height={48}
        />
      )}
      <div className="px-3 py-2 text-base font-bold leading-3 text-center border-b border-gray-400 text-general laptop:text-lg laptop:leading-4">
        {title}
      </div>
      <div className="px-3 mt-3 mb-1 text-sm whitespace-pre-wrap laptop:text-base">
        {shortDescription}
      </div>
      <div className="flex items-center justify-end w-full text-sm">
        <Button
          name="Подробнее"
          rounded={false}
          className="rounded-tl-lg"
          onClick={() => modalsFunc.service.view(serviceId)}
        />
      </div>
    </div>
  )
}

const ServicesBlock = () => {
  const filteredServices = useRecoilValue(filteredServicesSelector)
  if (!filteredServices || filteredServices.length === 0) return null
  return (
    <>
      <BlockContainer
        id="services"
        title="Наши услуги"
        // className="pb-0 "
        // childrenWrapperClassName="grid grid-cols-1 gap-x-2 gap-y-2 tablet:grid-cols-2 laptop:grid-cols-3"
        altBg
      >
        {/* <H2 className="sticky pt-20 top-6">{'Направления центра'}</H2> */}
        <Masonry gap={16}>
          {filteredServices.map((service, index) => {
            return (
              // <DirectionBlock
              //   key={direction._id}
              //   image={direction.image}
              //   title={direction.title}
              //   description={direction.description}
              //   inverse={index % 2 === (startInverse ? 1 : 0)}
              // />
              <ServiceItem
                key={service._id}
                serviceId={service._id}
                images={service.images}
                title={service.title}
                shortDescription={service.shortDescription}
              />
            )
          })}
        </Masonry>
      </BlockContainer>
    </>
  )
}

export default ServicesBlock
