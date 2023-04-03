import { useRecoilValue } from 'recoil'
import { modalsFuncAtom } from '@state/atoms'
import serviceSelector from '@state/selectors/serviceSelector'
import loadingAtom from '@state/atoms/loadingAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import servicesAtom from '@state/atoms/servicesAtom'

import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import sanitize from '@helpers/sanitize'
import PriceDiscount from '@components/PriceDiscount'
import Button from '@components/Button'

const ServiceCard = ({ serviceId, hidden = false, style }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const service = useRecoilValue(serviceSelector(serviceId))
  const loading = useRecoilValue(loadingAtom('service' + serviceId))
  const itemFunc = useRecoilValue(itemsFuncAtom)

  const services = useRecoilValue(servicesAtom)

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
    >
      {service?.images && service.images[0] && (
        // <div className="flex justify-center w-full tablet:w-auto">
        <img
          className="object-cover h-full w-36 tablet:w-48 max-h-60 tablet:max-h-72"
          src={service.images[0]}
          alt="service"
          // width={48}
          // height={48}
        />
        // </div>
      )}
      <div className="flex flex-col w-full">
        <div className="flex">
          <div className="flex-1 px-2 py-1 text-xl font-bold ">
            {service.title}
          </div>
          <CardButtons
            item={service}
            typeOfItem="service"
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
        <div className="flex-1 w-full max-w-full px-2 py-1 overflow-hidden text-sm textarea">
          {service.shortDescription}
        </div>
        <div className="flex items-center justify-between px-2 py-1 text-lg font-bold border-t gap-x-2 flex-nowrap">
          <PriceDiscount item={service} className="flex-1" />
          <Button
            name="Подать заявку"
            stopPropagation
            onClick={() => modalsFunc.service.apply(service._id)}
            thin
          />
        </div>
      </div>
    </CardWrapper>
  )
}

export default ServiceCard
