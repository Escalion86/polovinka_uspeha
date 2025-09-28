'use client'

import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import FormWrapper from '@components/FormWrapper'
import Note from '@components/Note'
import PriceInput from '@components/PriceInput'
import { postData } from '@helpers/CRUD'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'

const SettingsReferralSystemContent = () => {
  const location = useAtomValue(locationAtom)
  const loggedUser = useAtomValue(loggedUserActiveAtom)
  const [siteSettings, setSiteSettings] = useAtom(siteSettingsAtom)

  const [referrerCouponAmount, setReferrerCouponAmount] = useState(0)
  const [referralCouponAmount, setReferralCouponAmount] = useState(0)
  const [requirePaidEvent, setRequirePaidEvent] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const currentProgram = siteSettings?.referralProgram ?? {}
  const normalizedEnabled = currentProgram.enabled ?? false

  useEffect(() => {
    setEnabled(normalizedEnabled)
    setReferrerCouponAmount(currentProgram.referrerCouponAmount ?? 0)
    setReferralCouponAmount(currentProgram.referralCouponAmount ?? 0)
    setRequirePaidEvent(currentProgram.requirePaidEvent ?? false)
  }, [
    normalizedEnabled,
    currentProgram.referrerCouponAmount,
    currentProgram.referralCouponAmount,
    currentProgram.requirePaidEvent,
  ])

  const formChanged = useMemo(() => {
    return (
      normalizedEnabled !== enabled ||
      (currentProgram.referrerCouponAmount ?? 0) !== referrerCouponAmount ||
      (currentProgram.referralCouponAmount ?? 0) !== referralCouponAmount ||
      (currentProgram.requirePaidEvent ?? false) !== requirePaidEvent
    )
  }, [
    normalizedEnabled,
    currentProgram.referrerCouponAmount,
    currentProgram.referralCouponAmount,
    currentProgram.requirePaidEvent,
    referrerCouponAmount,
    referralCouponAmount,
    requirePaidEvent,
    enabled,
  ])

  const amountsZero = referrerCouponAmount === 0 && referralCouponAmount === 0
  const applyDisabled = !formChanged || isSaving || (enabled && amountsZero)
  const showZeroWarning = amountsZero && enabled

  const handleSave = async () => {
    if (!location) return
    if (enabled && amountsZero) {
      setMessage('')
      setError(
        'Нельзя включить реферальную систему, если суммы купонов для реферала и реферера равны нулю.'
      )
      return
    }

    setIsSaving(true)
    setMessage('')
    setError('')

    await postData(
      `/api/${location}/site`,
      {
        referralProgram: {
          enabled,
          referrerCouponAmount,
          referralCouponAmount,
          requirePaidEvent,
        },
      },
      (data) => {
        setSiteSettings(data)
        setMessage('Настройки обновлены успешно')
        setIsSaving(false)
      },
      () => {
        setError('Не удалось обновить настройки. Попробуйте ещё раз.')
        setIsSaving(false)
      },
      false,
      loggedUser?._id
    )
  }

  return (
    <div className="flex flex-col flex-1 h-screen px-2 my-2 gap-y-2">
      <div className="flex items-center w-full p-1 gap-x-1">
        <div className="flex flex-row-reverse flex-1">
          {formChanged && (
            <span className="leading-4 text-right tablet:text-lg">
              Чтобы изменения вступили в силу нажмите:
            </span>
          )}
        </div>
        <Button
          name="Применить"
          disabled={applyDisabled}
          loading={isSaving}
          onClick={handleSave}
        />
      </div>
      {error && <div className="text-danger">{error}</div>}
      {message && !isSaving && <div className="text-success">{message}</div>}
      <FormWrapper>
        <CheckBox
          checked={enabled}
          label="Включить реферальную систему"
          onClick={() => setEnabled((state) => !state)}
        />
        {showZeroWarning && (
          <Note className="!text-danger">
            Нельзя включить реферальную систему с нулевыми суммами купонов для
            реферала и реферера.
          </Note>
        )}
        <PriceInput
          label="Сумма купона для реферера"
          value={referrerCouponAmount}
          onChange={setReferrerCouponAmount}
        />
        <PriceInput
          label="Сумма купона для реферала"
          value={referralCouponAmount}
          onChange={setReferralCouponAmount}
        />
        <CheckBox
          checked={requirePaidEvent}
          label="Купоны выдаются только за посещение платного мероприятия"
          onClick={() => setRequirePaidEvent((state) => !state)}
        />
        <Note className="mt-2">
          Значения указываются в рублях. Купоны будут автоматически выдаваться
          при закрытии мероприятия, если приглашённый пользователь посещает его
          впервые и выполняет выбранные условия.
        </Note>
      </FormWrapper>
    </div>
  )
}

export default SettingsReferralSystemContent
