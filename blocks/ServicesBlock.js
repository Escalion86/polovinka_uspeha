import BlockContainer from '@components/BlockContainer'
import Button from '@components/Button'
import Masonry from '@components/Masonry'
import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
import filteredServicesSelector from '@state/selectors/filteredServicesSelector'
import { useAtomValue } from 'jotai'

const ServiceItem = ({ serviceId, title, shortDescription, images }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  return (
    <div className="flex-col w-full max-w-[430px] overflow-hidden bg-white rounded-lg shadow-xl gap-y-1">
      {images && (
        <img
          className="object-cover w-full max-h-[220px]"
          src={images[0]}
          alt="service"
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
  const filteredServices = useAtomValue(filteredServicesSelector)
  if (!filteredServices || filteredServices.length === 0) return null
  return (
    <>
      <BlockContainer id="services" title="Наши услуги" altBg>
        <Masonry gap={16}>
          {filteredServices.map((service, index) => {
            return (
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
