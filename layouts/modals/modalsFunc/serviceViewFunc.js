import Button from '@components/Button'
import ServiceCardButtons from '@components/cardButtons/ServiceCardButtons'
import Divider from '@components/Divider'
import ImageGallery from '@components/ImageGallery'
import PriceDiscount from '@components/PriceDiscount'
import TextLine from '@components/TextLine'
import NoOrphanText from '@components/NoOrphanText'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import serviceSelector from '@state/selectors/serviceSelector'
import DOMPurify from 'isomorphic-dompurify'
import { useEffect } from 'react'
import { useAtomValue } from 'jotai'

const CardButtonsComponent = ({ service }) => (
  <ServiceCardButtons item={service} forForm />
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
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const service = useAtomValue(serviceSelector(serviceId))
    const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
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
            <NoOrphanText
              as="div"
              className="w-full max-w-full overflow-hidden list-disc ql textarea"
              html={DOMPurify.sanitize(service?.description)}
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
