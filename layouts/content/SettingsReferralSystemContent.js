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

  const [enabled, setEnabled] = useState(false)
  const [referrerCouponAmount, setReferrerCouponAmount] = useState(0)
  const [referralCouponAmount, setReferralCouponAmount] = useState(0)
  const [requirePaidEvent, setRequirePaidEvent] = useState(false)
  const [enabledForCenter, setEnabledForCenter] = useState(false)
  const [enabledForClub, setEnabledForClub] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const currentProgram = siteSettings?.referralProgram ?? {}
  const normalizedEnabled =
    typeof currentProgram.enabled === 'boolean'
      ? currentProgram.enabled === true
      : currentProgram.enabledForCenter === true ||
        currentProgram.enabledForClub === true
  const normalizedCenterEnabled =
    typeof currentProgram.enabledForCenter === 'boolean'
      ? currentProgram.enabledForCenter
      : normalizedEnabled
  const normalizedClubEnabled =
    typeof currentProgram.enabledForClub === 'boolean'
      ? currentProgram.enabledForClub
      : normalizedEnabled

  useEffect(() => {
    setEnabled(normalizedEnabled)
    setEnabledForCenter(normalizedCenterEnabled)
    setEnabledForClub(normalizedClubEnabled)
    setReferrerCouponAmount(currentProgram.referrerCouponAmount ?? 0)
    setReferralCouponAmount(currentProgram.referralCouponAmount ?? 0)
    setRequirePaidEvent(currentProgram.requirePaidEvent ?? false)
  }, [
    normalizedEnabled,
    normalizedCenterEnabled,
    normalizedClubEnabled,
    currentProgram.referrerCouponAmount,
    currentProgram.referralCouponAmount,
    currentProgram.requirePaidEvent,
  ])

  const formChanged = useMemo(() => {
    return (
      normalizedEnabled !== enabled ||
      normalizedCenterEnabled !== enabledForCenter ||
      normalizedClubEnabled !== enabledForClub ||
      (currentProgram.referrerCouponAmount ?? 0) !== referrerCouponAmount ||
      (currentProgram.referralCouponAmount ?? 0) !== referralCouponAmount ||
      (currentProgram.requirePaidEvent ?? false) !== requirePaidEvent
    )
  }, [
    normalizedEnabled,
    normalizedCenterEnabled,
    normalizedClubEnabled,
    currentProgram.referrerCouponAmount,
    currentProgram.referralCouponAmount,
    currentProgram.requirePaidEvent,
    referrerCouponAmount,
    referralCouponAmount,
    requirePaidEvent,
    enabled,
    enabledForCenter,
    enabledForClub,
  ])

  const amountsZero = referrerCouponAmount === 0 && referralCouponAmount === 0
  const programEnabled = enabled
  const applyDisabled =
    !formChanged || isSaving || (programEnabled && amountsZero)
  const showZeroWarning = amountsZero && programEnabled

  const handleSave = async () => {
    if (!location) return
    if (programEnabled && amountsZero) {
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
          enabledForCenter,
          enabledForClub,
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
          label="Реферальная система включена"
          onClick={() => setEnabled((state) => !state)}
        />
        <CheckBox
          checked={enabledForCenter}
          label="Для Центра"
          onClick={() => setEnabledForCenter((state) => !state)}
        />
        <CheckBox
          checked={enabledForClub}
          label="Для Клуба"
          onClick={() => setEnabledForClub((state) => !state)}
        />
        <Note>
          Галочки «Для Центра» и «Для Клуба» управляют доступностью страницы
          «Рефералы» для соответствующих пользователей.
        </Note>
        {showZeroWarning && (
          <Note type="error">
            Нельзя включить реферальную систему для Центра или Клуба с нулевыми
            суммами купонов для реферала и реферера.
          </Note>
        )}
        <Note className="mt-2">
          Реферер - тот кто приглашает;
          <br />
          Реферал - тот кого приглашают.
        </Note>
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
          label="Купоны рефереру выдаются только за посещение ПЛАТНОГО мероприятия рефералом"
          onClick={() => setRequirePaidEvent((state) => !state)}
        />
        <Note className="mt-2">
          Купоны будут автоматически выдаваться:
          <br />
          Рефереру - при посещении мероприятия рефералом;
          <br />
          Рефералу - при регистрации на сайте по ссылке реферера.
        </Note>
      </FormWrapper>
    </div>
  )
}

export default SettingsReferralSystemContent
