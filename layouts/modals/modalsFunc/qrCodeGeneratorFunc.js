import FormWrapper from '@components/FormWrapper'
import { useAtomValue } from 'jotai'
import locationAtom from '@state/atoms/locationAtom'
import useRouter from '@utils/useRouter'

const qrCodeGeneratorFunc = ({ type, id, title, link }) => {
  const QRCodeGeneratorFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const location = useAtomValue(locationAtom)
    const router = useRouter()
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : ''

    const targetLink = link
      ? link
      : `${origin ? `${origin}/` : '/'}${location}/cabinet/${
          type ?? router.query.page
        }${id ? `?id=${id}` : ''}`
    const encodedLink = encodeURIComponent(targetLink)

    return (
      <FormWrapper flex className="flex justify-center">
        {/* <div className="relative"> */}
        <img
          className="max-w-[300px] aspect-1 w-full"
          src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodedLink}&size=300x300`}
          alt="qr-code"
        />
        {/* <Image
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl top-1/2 left-1/2"
            src="/maskable_icon_x192.png"
            width={52}
            height={52}
            // fill
            alt="logo"
            // priority
            // placeholder="blur"
            // blurDataURL={'/img/logo_heart_24px.png'}
            // style={{ width: 'auto', height: 'auto' }}
          /> */}
        {/* </div> */}
        {/* {!qrCode ? <LoadingSpinner /> : <div>Загружено</div>} */}
      </FormWrapper>
    )
  }

  return {
    title: title ?? `Генератор QR-кодов`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: QRCodeGeneratorFuncModal,
  }
}

export default qrCodeGeneratorFunc
