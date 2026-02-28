'use client'

import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImage from '@components/InputImage'
import { postData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useEffect, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import locationAtom from '@state/atoms/locationAtom'

const FounderBlockContent = (props) => {
  const location = useAtomValue(locationAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const [siteSettings, setSiteSettings] = useAtom(siteSettingsAtom)
  const [photo, setPhoto] = useState(siteSettings?.founder?.photo ?? null)
  const [quote, setQuote] = useState(siteSettings?.founder?.quote ?? '')
  const [name, setName] = useState(siteSettings?.founder?.name ?? '')
  const [showOnSite, setShowOnSite] = useState(
    Boolean(siteSettings?.founder?.showOnSite)
  )

  const [errors, _checkErrors, addError, removeError] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)
  const [message, setMessage] = useState('')

  const normalizedFounder = {
    photo: siteSettings?.founder?.photo ?? null,
    quote: siteSettings?.founder?.quote ?? '',
    name: siteSettings?.founder?.name ?? '',
    showOnSite: Boolean(siteSettings?.founder?.showOnSite),
  }
  const formChanged =
    normalizedFounder.photo !== photo ||
    normalizedFounder.quote !== quote ||
    normalizedFounder.name !== name ||
    normalizedFounder.showOnSite !== showOnSite

  const onClickConfirm = async () => {
    let hasErrors = false

    if (showOnSite && !photo) {
      hasErrors = true
      addError({ founderPhoto: 'Загрузите фотографию основателя' })
    }
    if (showOnSite && !name?.trim()) {
      hasErrors = true
      addError({ founderName: 'Введите имя и фамилию основателя' })
    }
    if (showOnSite && !quote?.trim()) {
      hasErrors = true
      addError({ founderQuote: 'Введите цитату основателя' })
    }
    if (hasErrors) return

    setIsWaitingToResponse(true)
    setMessage('')

    await postData(
      `/api/${location}/site`,
      {
        founder: { photo, quote, name, showOnSite },
      },
      (data) => {
        setSiteSettings(data)
        setMessage('Данные обновлены успешно')
        setIsWaitingToResponse(false)
      },
      () => {
        setMessage('')
        addError({ response: 'Ошибка обновления данных' })
        setIsWaitingToResponse(false)
      },
      false,
      loggedUserActive?._id
    )
  }

  useEffect(() => {
    if (isWaitingToResponse) {
      setIsWaitingToResponse(false)
    }
  }, [props])

  useEffect(() => {
    setPhoto(normalizedFounder.photo)
    setQuote(normalizedFounder.quote)
    setName(normalizedFounder.name)
    setShowOnSite(normalizedFounder.showOnSite)
  }, [siteSettings?.founder])

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
          disabled={!formChanged}
          onClick={onClickConfirm}
          loading={isWaitingToResponse}
        />
      </div>
      <ErrorsList errors={errors} />
      {message && !isWaitingToResponse && (
        <div className="flex flex-col col-span-2 text-success">{message}</div>
      )}
      <div className="font-semibold text-[#6b1f2a] px-2">Основатель проекта</div>
      <FormWrapper>
        <InputImage
          label="Фотография основателя"
          directory="supervisor"
          image={photo}
          onChange={(value) => {
            removeError('founderPhoto')
            setPhoto(value)
          }}
          error={errors.founderPhoto}
          required={showOnSite}
        />
        <Input
          label="Имя и Фамилия основателя"
          value={name}
          onChange={(value) => {
            removeError('founderName')
            setName(value)
          }}
          error={errors.founderName}
          required={showOnSite}
        />
        <Input
          label="Цитата основателя"
          value={quote}
          onChange={(value) => {
            removeError('founderQuote')
            setQuote(value)
          }}
          error={errors.founderQuote}
          required={showOnSite}
        />
        <CheckBox
          checked={showOnSite}
          labelPos="left"
          onClick={() => setShowOnSite((checked) => !checked)}
          label="Показывать на сайте"
        />
      </FormWrapper>
    </div>
  )
}

export default FounderBlockContent
