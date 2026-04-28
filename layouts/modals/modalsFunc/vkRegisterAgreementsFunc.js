import { useEffect, useState } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

const vkRegisterAgreementsFunc = ({ onConfirm } = {}) => {
  const VkRegisterAgreementsModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const [check18, setCheck18] = useState(false)
    const [checkAgreement, setCheckAgreement] = useState(false)
    const [checkConsentToMailing, setCheckConsentToMailing] = useState(false)

    const bothChecked = check18 && checkAgreement

    useEffect(() => {
      setDisableConfirm(!bothChecked)
      setOnConfirmFunc(
        bothChecked
          ? async () => {
              const result = await onConfirm?.({
                isAdultConfirmed: check18,
                personalDataAgreementAccepted: checkAgreement,
                consentToMailing: checkConsentToMailing,
              })
              if (result === false) return
              closeModal()
            }
          : undefined
      )
    }, [
      bothChecked,
      check18,
      checkAgreement,
      checkConsentToMailing,
      closeModal,
      setDisableConfirm,
      setOnConfirmFunc,
      onConfirm,
    ])

    useEffect(() => {
      setDisableDecline(false)
      setOnDeclineFunc(() => {
        closeModal()
      })
    }, [closeModal, setDisableDecline, setOnDeclineFunc])

    return (
      <div className="grid gap-5 text-base leading-relaxed text-[#3a2c33]">
        <p>
          Аккаунт с номером из VK ID еще не найден. Чтобы создать аккаунт,
          подтвердите обязательные согласия.
        </p>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={check18}
            onChange={() => setCheck18((prev) => !prev)}
            className="mt-1.5 h-5 w-5 shrink-0 accent-[#6b1f2a]"
          />
          <span>
            <span className="text-[#b4232d]">*</span> Мне исполнилось 18 лет
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={checkAgreement}
            onChange={() => setCheckAgreement((prev) => !prev)}
            className="mt-1.5 h-5 w-5 shrink-0 accent-[#6b1f2a]"
          />
          <span>
            <span className="text-[#b4232d]">*</span> Согласен на{' '}
            <Link
              href="/legal/personal-data-consent"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline text-[#6b1f2a] hover:text-[#8b2a38]"
            >
              обработку персональных данных
            </Link>{' '}
            и с{' '}
            <Link
              href="/docs/politika.docx"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline text-[#6b1f2a] hover:text-[#8b2a38]"
            >
              политикой конфиденциальности
            </Link>
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={checkConsentToMailing}
            onChange={() => setCheckConsentToMailing((prev) => !prev)}
            className="mt-1.5 h-5 w-5 shrink-0 accent-[#6b1f2a]"
          />
          <span>Согласен получать рассылку о мероприятиях</span>
        </label>
      </div>
    )
  }

  VkRegisterAgreementsModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    setOnConfirmFunc: PropTypes.func.isRequired,
    setOnDeclineFunc: PropTypes.func.isRequired,
    setDisableConfirm: PropTypes.func.isRequired,
    setDisableDecline: PropTypes.func.isRequired,
  }

  return {
    title: 'Регистрация через VK ID',
    Children: VkRegisterAgreementsModal,
    confirmButtonName: 'Создать аккаунт',
    declineButtonName: 'Отмена',
    closeButtonShow: false,
  }
}

vkRegisterAgreementsFunc.propTypes = {
  onConfirm: PropTypes.func,
}

export default vkRegisterAgreementsFunc
