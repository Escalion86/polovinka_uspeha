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
    const [qrSrc, setQrSrc] = useState('')
    const [hasQrError, setHasQrError] = useState(false)
    const [qrErrorText, setQrErrorText] = useState('')
    const location = useAtomValue(locationAtom)
    const router = useRouter()
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : ''
    const qrServiceBaseUrl = (
      process.env.NEXT_PUBLIC_QR_SERVICE_URL || ''
    ).replace(/\/$/, '')

    const targetLink = link
      ? link
      : `${origin ? `${origin}/` : '/'}${location}/cabinet/${
          type ?? router.query.page
        }${id ? `?id=${id}` : ''}`

    useEffect(() => {
      setIsQrLoading(true)
      setHasQrError(false)
      setQrErrorText('')
      setQrSrc('')
      if (!qrServiceBaseUrl) {
        setQrSrc('')
        setHasQrError(true)
        setQrErrorText('Не задан NEXT_PUBLIC_QR_SERVICE_URL')
        setIsQrLoading(false)
        return
      }

      const controller = new AbortController()
      let objectUrl = ''

      const fetchQr = async () => {
        try {
          const response = await fetch(`${qrServiceBaseUrl}/api/v1/qr/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'url',
              data: { url: targetLink },
              options: {
                width: 300,
                margin: 2,
                errorCorrectionLevel: 'H',
              },
            }),
            signal: controller.signal,
          })

          if (!response.ok) {
            const errorText = await response.text().catch(() => '')
            throw new Error(
              `QR service response error: ${response.status}${
                errorText ? ` (${errorText})` : ''
              }`
            )
          }

          const blob = await response.blob()
          objectUrl = URL.createObjectURL(blob)
          setQrSrc(objectUrl)
          setHasQrError(false)
          setQrErrorText('')
        } catch (error) {
          if (controller.signal.aborted) return
          setQrSrc('')
          setHasQrError(true)
          setQrErrorText(
            error?.message || 'Ошибка генерации QR на сервисе'
          )
        } finally {
          if (!controller.signal.aborted) setIsQrLoading(false)
        }
      }

      fetchQr()

      return () => {
        controller.abort()
        if (objectUrl) URL.revokeObjectURL(objectUrl)
      }
    }, [qrServiceBaseUrl, targetLink])

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
          {(isQrLoading || (!qrSrc && !hasQrError)) && (
            <LoadingSpinner
              size="sm"
              text="Загружаем QR-код..."
              className="absolute inset-0 z-10"
            />
          )}
          {qrSrc ? (
            <>
              <img
                className={`max-w-[300px] aspect-1 w-full transition-opacity duration-150 ${
                  isQrLoading ? 'opacity-0' : 'opacity-100'
                }`}
                src={qrSrc}
                alt="qr-code"
              />
              {!isQrLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white rounded-full p-2 shadow-sm">
                    <img
                      src="/img/logo_heart_qr.png"
                      alt="qr-logo"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            hasQrError &&
            !isQrLoading && (
              <div className="text-center text-sm text-gray-600 px-4">
                Не удалось загрузить QR-код. {qrErrorText || ''}
              </div>
            )
          )}
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
