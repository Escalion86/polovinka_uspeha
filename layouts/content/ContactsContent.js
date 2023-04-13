import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'

import Button from '@components/Button'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import PhoneInput from '@components/PhoneInput'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

// TODO Сделать правильное обновление страницы (а не полную перезагрузку), а также добавить редактирование Email
const ContactsContent = (props) => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const [siteSettings, setSiteSettings] = useRecoilState(siteSettingsAtom)
  const [phone, setPhone] = useState(siteSettings?.phone)
  const [whatsapp, setWhatsapp] = useState(siteSettings?.whatsapp)
  const [viber, setViber] = useState(siteSettings?.viber)
  const [telegram, setTelegram] = useState(siteSettings?.telegram)
  const [instagram, setInstagram] = useState(siteSettings?.instagram)
  const [vk, setVk] = useState(siteSettings?.vk)
  const [email, setEmail] = useState(siteSettings?.email)

  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)
  const [message, setMessage] = useState('')

  const formChanged =
    siteSettings?.phone !== phone ||
    siteSettings?.whatsapp !== whatsapp ||
    siteSettings?.viber !== viber ||
    siteSettings?.telegram !== telegram ||
    siteSettings?.instagram !== instagram ||
    siteSettings?.vk !== vk ||
    siteSettings?.email !== email

  const onClickConfirm = async () => {
    if (
      !checkErrors({
        phoneNoRequired: phone,
        viber,
        whatsapp,
        email,
      })
    )
      await postData(
        `/api/site`,
        {
          phone,
          whatsapp,
          viber,
          telegram,
          instagram,
          vk,
          email,
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
        loggedUser?._id
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
        <FormWrapper twoColumns>
          <PhoneInput
            label="Телефон"
            value={phone}
            onChange={setPhone}
            error={errors.phone}
            copyPasteButtons
          />
          <PhoneInput
            label="Whatsapp"
            value={whatsapp}
            onChange={setWhatsapp}
            error={errors.whatsapp}
            copyPasteButtons
          />
        </FormWrapper>
        <FormWrapper twoColumns>
          <PhoneInput
            label="Viber"
            value={viber}
            onChange={setViber}
            error={errors.viber}
            copyPasteButtons
          />
          <Input
            prefix="@"
            label="Telegram"
            value={telegram}
            onChange={setTelegram}
            copyPasteButtons
          />
        </FormWrapper>
        <FormWrapper twoColumns>
          <Input
            prefix="@"
            label="Instagram"
            value={instagram}
            onChange={setInstagram}
            copyPasteButtons
          />
          <Input
            prefix="@"
            label="Vk"
            value={vk}
            onChange={setVk}
            copyPasteButtons
          />
        </FormWrapper>
        <Input
          label="Email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          copyPasteButtons
        />
      </FormWrapper>
    </div>
  )
}

export default ContactsContent
