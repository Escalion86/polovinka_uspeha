import Button from '@components/Button'
import ServiceCardButtons from '@components/cardButtons/ServiceCardButtons'
import CardWrapper from '@components/CardWrapper'
import DirectionTitleById from '@components/DirectionTitleById'
import NoOrphanText from '@components/NoOrphanText'
import PriceDiscount from '@components/PriceDiscount'
import TextLinesLimiter from '@components/TextLinesLimiter'
import modalsFuncAtom from '@state/modalsFuncAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import servicesAtom from '@state/atoms/servicesAtom'
import serviceSelector from '@state/selectors/serviceSelector'
import { useAtomValue } from 'jotai'

const ServiceCard = ({ serviceId, hidden = false, style }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const service = useAtomValue(serviceSelector(serviceId))
  const loading = useAtomValue(loadingAtom('service' + serviceId))
  const itemFunc = useAtomValue(itemsFuncAtom)

  const services = useAtomValue(servicesAtom)

  const setUp = async () => {
    if (service.index === 0) return

    var movedUp = false
    var movedDown = false
    const itemsToChange = services.map((item) => {
      if (!item.index && item.index === 0)
        Object.keys(services).reduce((key, v) =>
          services[v] < services[key] ? v : key
        )

      if (item.index === service.index)
        if (!movedUp) {
          movedUp = true
          return { ...item, index: item.index - 1 }
        }

      if (item.index === service.index - 1)
        if (!movedDown) {
          movedDown = true
          return { ...item, index: item.index + 1 }
        }
    })
    await Promise.all(
      itemsToChange.map(async (item) => {
        if (item)
          await itemFunc.service.set({
            _id: item._id,
            index: item.index,
          })
      })
    )
  }

  const setDown = async () => {
    if (service.index >= services.length - 1) return

    var movedUp = false
    var movedDown = false
    const itemsToChange = services.map((item) => {
      if (item.index === service.index)
        if (!movedDown) {
          movedDown = true
          return { ...item, index: item.index + 1 }
        }
      if (item.index === service.index + 1)
        if (!movedUp) {
          movedUp = true
          return { ...item, index: item.index - 1 }
        }
    })
    await Promise.all(
      itemsToChange.map(async (item) => {
        if (item)
          await itemFunc.service.set({
            _id: item._id,
            index: item.index,
          })
      })
    )
  }

  return (
    <CardWrapper
      loading={loading}
      onClick={() => modalsFunc.service.view(service._id)}
      showOnSite={service.showOnSite}
      hidden={hidden}
      style={style}
      className="rounded-[22px] border border-[rgba(107,31,42,0.16)] shadow-[0_16px_30px_rgba(0,0,0,0.1)]"
      bgClassName="bg-white/95"
      outerClassName="px-3 py-2"
    >
      {service?.images && service.images[0] && (
        <div className="flex justify-center w-32 p-2 min-w-32 tablet:min-w-40 tablet:w-40 max-h-48 tablet:max-h-56">
          <img
            className="object-cover w-full h-full rounded-[16px] border border-[#f0e5ea] bg-white/80"
            src={service.images[0]}
            alt="service"
          />
        </div>
      )}
      <div className="flex flex-col w-full">
        <div className="flex items-center pl-4 pr-2 py-1 laptop:rounded-bl-[22px] laptop:rounded-tr-[22px] bg-[linear-gradient(135deg,rgba(107,31,42,0.08),rgba(79,176,232,0.12))]">
          <TextLinesLimiter
            className="flex-1 text-lg font-bold text-[#4b0f1c]"
            lines={1}
            textCenter={false}
          >
            {service?.title ?? '[неизвестная услуга]'}
          </TextLinesLimiter>
          {/* <div className="flex-1 px-2 py-1 text-xl font-bold ">
            {service.title}
          </div> */}
          <ServiceCardButtons
            item={service}
            showOnSiteOnClick={() => {
              itemFunc.service.set({
                _id: service._id,
                showOnSite: !service.showOnSite,
              })
            }}
            onUpClick={service.index > 0 && setUp}
            onDownClick={service.index < services.length - 1 && setDown}
          />
        </div>
        {/* <div>{direction.description}</div> */}
        <NoOrphanText
          as="div"
          className="flex-1 w-full max-w-full px-2 pb-1 overflow-hidden text-sm text-[#3a2c33] whitespace-pre-wrap"
          text={service.shortDescription}
        />
        {service?.directionId && (
          <div className="px-2 pb-2 text-xs font-semibold text-[#6b1f2a]/70">
            <DirectionTitleById directionId={service.directionId} />
          </div>
        )}
        <div className="flex items-center justify-between px-2 py-1 text-lg font-bold border-t border-[#f0e5ea] gap-x-2 flex-nowrap">
          <div className="inline-flex rounded-full bg-[#f7f1f4] px-3 py-1">
            <PriceDiscount
              item={service}
              className="font-futura font-semibold text-[18px] text-[#6b1f2a]"
            />
          </div>
          <Button
            name="Подать заявку"
            stopPropagation
            onClick={() => modalsFunc.service.apply(service._id)}
            thin
            roundedFull
          />
        </div>
      </div>
    </CardWrapper>
  )
}

export default ServiceCard
