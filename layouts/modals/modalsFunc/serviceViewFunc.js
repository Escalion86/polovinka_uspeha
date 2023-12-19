import Button from '@components/Button'
import CardButtons from '@components/CardButtons'
import Divider from '@components/Divider'
import ImageGallery from '@components/ImageGallery'
import PriceDiscount from '@components/PriceDiscount'
import TextLine from '@components/TextLine'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import serviceSelector from '@state/selectors/serviceSelector'
import DOMPurify from 'isomorphic-dompurify'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

const CardButtonsComponent = ({ service }) => (
  <CardButtons item={service} typeOfItem="service" forForm />
)

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
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const service = useRecoilValue(serviceSelector(serviceId))
    // const loggedUser = useRecoilValue(loggedUserAtom)
    const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
    const isLoggedUserDev = loggedUserActiveRole?.dev
    const canEdit = loggedUserActiveRole?.services?.edit

    useEffect(() => {
      if (canEdit && setTopLeftComponent)
        setTopLeftComponent(() => <CardButtonsComponent service={service} />)
    }, [service, canEdit, setTopLeftComponent])

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
          <div className="relative flex flex-col flex-1 w-full max-w-full px-2 py-2">
            <div className="flex justify-center w-full text-3xl font-bold">
              {service?.title}
            </div>
            {!setTopLeftComponent && (
              <div className="absolute right-0">
                <CardButtonsComponent service={service} />
              </div>
            )}
            <div
              className="w-full max-w-full overflow-hidden list-disc ql textarea"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(service?.description),
              }}
            />

            {isLoggedUserDev && (
              <>
                <Divider thin light />
                <TextLine label="ID">{service?._id}</TextLine>
              </>
            )}
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
