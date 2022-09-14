import Button from '@components/Button'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import PhoneInput from '@components/PhoneInput'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

// TODO Сделать правильное обновление страницы (а не полную перезагрузку), а также добавить редактирование Email
const ContactsContent = (props) => {
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
        }
      )
  }

  useEffect(() => {
    if (isWaitingToResponse) {
      setIsWaitingToResponse(false)
      // setMessage('Данные анкеты обновлены успешно')
    }
  }, [props])

  return (
    <div className="flex flex-col flex-1 h-screen px-2 my-2 gap-y-2">
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
      <div className="flex flex-col w-full p-1">
        <ErrorsList errors={errors} />
        <Button
          name="Применить"
          disabled={!formChanged}
          onClick={onClickConfirm}
          loading={isWaitingToResponse}
        />
        {message && !isWaitingToResponse && (
          <div className="flex flex-col col-span-2 text-success">{message}</div>
        )}
      </div>
    </div>
  )
}

export default ContactsContent
