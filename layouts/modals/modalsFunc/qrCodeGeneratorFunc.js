import FormWrapper from '@components/FormWrapper'
import LoadingSpinner from '@components/LoadingSpinner'
import copyToClipboard from '@helpers/copyToClipboard'
import useSnackbar from '@helpers/useSnackbar'
import { useAtomValue } from 'jotai'
import locationAtom from '@state/atoms/locationAtom'
import useRouter from '@utils/useRouter'
import { useEffect, useState } from 'react'

const qrCodeGeneratorFunc = ({ type, id, title, link }) => {
  const QRCodeGeneratorFuncModal = ({
    closeModal,
    setOnConfirmFunc,
  }) => {
    const { info } = useSnackbar()
    const [isQrLoading, setIsQrLoading] = useState(true)
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

    useEffect(() => {
      setIsQrLoading(true)
    }, [encodedLink])

    useEffect(() => {
      setOnConfirmFunc(() => {
        copyToClipboard(targetLink)
        info('Ссылка скопирована в буфер обмена')
        closeModal()
      })
    }, [closeModal, info, setOnConfirmFunc, targetLink])

    return (
      <FormWrapper flex className="flex justify-center">
        <div className="relative flex items-center justify-center max-w-[300px] aspect-1 w-full min-h-[300px]">
          {isQrLoading && (
            <LoadingSpinner
              size="sm"
              text="Загружаем QR-код..."
              className="absolute inset-0 z-10"
            />
          )}
          <img
            className={`max-w-[300px] aspect-1 w-full transition-opacity duration-150 ${
              isQrLoading ? 'opacity-0' : 'opacity-100'
            }`}
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodedLink}&size=300x300`}
            alt="qr-code"
            onLoad={() => setIsQrLoading(false)}
            onError={() => setIsQrLoading(false)}
          />
        </div>
      </FormWrapper>
    )
  }

  return {
    title: title ?? `Генератор QR-кодов`,
    confirmButtonName: 'Скопировать ссылку',
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: QRCodeGeneratorFuncModal,
  }
}

export default qrCodeGeneratorFunc
