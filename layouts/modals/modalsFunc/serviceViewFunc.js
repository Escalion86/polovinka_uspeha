import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

import PriceDiscount from '@components/PriceDiscount'
import Divider from '@components/Divider'

import sanitize from '@helpers/sanitize'
import { modalsFuncAtom } from '@state/atoms'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import ImageGallery from '@components/ImageGallery'
import CardButtons from '@components/CardButtons'
import TextLine from '@components/TextLine'
import serviceSelector from '@state/selectors/serviceSelector'
import Button from '@components/Button'
// import loggedUserAtom from '@state/atoms/loggedUserAtom'

const serviceViewFunc = (serviceId) => {
  const ServiceViewModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const service = useRecoilValue(serviceSelector(serviceId))
    // const loggedUser = useRecoilValue(loggedUserAtom)
    const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
    const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)

    const modalsFunc = useRecoilValue(modalsFuncAtom)

    useEffect(() => {
      if (isLoggedUserModer && setTopLeftComponent)
        setTopLeftComponent(() => (
          <CardButtons
            item={{ _id: serviceId }}
            typeOfItem="service"
            forForm
            direction="right"
          />
        ))
    }, [isLoggedUserModer, setTopLeftComponent])

    if (!service || !serviceId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Услуга не найдена!
        </div>
      )

    return (
      <div className="flex flex-col gap-y-2">
        <ImageGallery images={service?.images} />
        <div className="flex flex-col flex-1">
          <div className="flex flex-col flex-1 w-full max-w-full px-2 py-2">
            <div className="flex justify-center w-full text-3xl font-bold">
              {service?.title}
            </div>
            <div
              className="w-full max-w-full overflow-hidden list-disc ql textarea"
              dangerouslySetInnerHTML={{
                __html: sanitize(service?.description),
              }}
            />
            <Divider thin light />
            {isLoggedUserDev && <TextLine label="ID">{service?._id}</TextLine>}
          </div>
          <Divider thin light />
          <div className="flex flex-col items-center w-full phoneH:justify-between phoneH:flex-row">
            <PriceDiscount
              item={service}
              className="px-2"
              prefix="Стоимость:"
            />
            <Button
              name="Подать заявку"
              stopPropagation
              onClick={() => modalsFunc.service.apply(service._id)}
              thin
            />
          </div>
        </div>
      </div>
    )
  }

  return {
    title: `Услуга`,
    confirmButtonName: 'Подать заявку',
    Children: ServiceViewModal,
  }
}

export default serviceViewFunc
