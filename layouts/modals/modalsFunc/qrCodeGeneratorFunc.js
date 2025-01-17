import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import { getData } from '@helpers/CRUD'
// import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import locationAtom from '@state/atoms/locationAtom'
import LoadingSpinner from '@components/LoadingSpinner'

const qrCodeGeneratorFunc = (type, id, onSuccess) => {
  const QRCodeGeneratorFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const location = useAtomValue(locationAtom)
    const [qrCode, setQrCode] = useState()
    console.log('qrCode', qrCode)

    useEffect(() => {
      const getQrCode = async () => {
        const data = await getData(
          `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example `
        )
        setQrCode(data)
      }
      getQrCode()
    }, [])

    return (
      <FormWrapper flex className="flex-col">
        {!qrCode ? <LoadingSpinner /> : <div>Загружено</div>}
      </FormWrapper>
    )
  }

  return {
    title: `Генератор QR-кодов`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: QRCodeGeneratorFuncModal,
  }
}

export default qrCodeGeneratorFunc
