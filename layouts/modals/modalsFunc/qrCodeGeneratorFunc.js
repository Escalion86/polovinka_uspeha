import FormWrapper from '@components/FormWrapper'
import { useAtomValue } from 'jotai'
import locationAtom from '@state/atoms/locationAtom'
import { useRouter } from 'next/router'

const qrCodeGeneratorFunc = ({ type, id, title }) => {
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

    return (
      <FormWrapper flex className="flex justify-center">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?data=${origin}/${location}/cabinet/${type ?? router.query.page}${id ? `?id=${id}` : ''}&amp;size=300x300`}
          alt=""
          title=""
        />
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
