'use client'

import Button from '@components/Button'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import PhoneInput from '@components/PhoneInput'
import { postData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useEffect, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import locationAtom from '@state/atoms/locationAtom'
import Textarea from '@components/Textarea'

const TitleBlockContent = (props) => {
  const location = useAtomValue(locationAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const [siteSettings, setSiteSettings] = useAtom(siteSettingsAtom)
  const [title, setTitle] = useState(siteSettings?.title || '')
  const [subtitle, setSubtitle] = useState(siteSettings?.subtitle || '')

  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)
  const [message, setMessage] = useState('')

  const formChanged =
    (siteSettings?.title || '') !== title ||
    (siteSettings?.subtitle || '') !== subtitle

  const onClickConfirm = async () => {
    await postData(
      `/api/${location}/site`,
      {
        title,
        subtitle,
      },
      (data) => {
        setSiteSettings(data)
        setMessage('Данные обновлены успешно')
        setIsWaitingToResponse(false)
        // refreshPage()
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
      // setMessage('Данные анкеты обновлены успешно')
    }
  }, [props])

  const buttonDisabled = !formChanged

  return (
    <div className="flex flex-col flex-1 h-screen px-2 my-2 gap-y-2">
      <div className="flex items-center w-full p-1 gap-x-1">
        <div className="flex flex-row-reverse flex-1">
          {!buttonDisabled && (
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
      <FormWrapper>
        <Input
          label="Заголовок (под логотипом)"
          value={title}
          onChange={setTitle}
        />
        {/* <Input
          label={'Подзаголовок (под кнопкой "Зарегистрироваться")'}
          value={subtitle}
          onChange={setSubtitle}
          copyPasteButtons
        /> */}
        <Textarea
          label={'Подзаголовок (под кнопкой "Зарегистрироваться")'}
          value={subtitle}
          onChange={setSubtitle}
        />
      </FormWrapper>
    </div>
  )
}

export default TitleBlockContent
