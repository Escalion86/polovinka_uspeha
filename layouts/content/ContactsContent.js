import Button from '@components/Button'
import DatePicker from '@components/DatePicker'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImage from '@components/InputImage'
import PhoneInput from '@components/PhoneInput'
import Textarea from '@components/Textarea'
import GenderPicker from '@components/ValuePicker/GenderPicker'
import OrientationPicker from '@components/ValuePicker/OrientationPicker'
import { postData, putData } from '@helpers/CRUD'
import getZodiac from '@helpers/getZodiac'
import useErrors from '@helpers/useErrors'
import { useRouter } from 'next/router'
import { useState } from 'react'

// TODO Сделать правильное обновление страницы (а не полную перезагрузку), а также добавить редактирование Email
const ContactsContent = (props) => {
  const siteSettings = props.siteSettings
  const [phone, setPhone] = useState(siteSettings?.phone)
  const [whatsapp, setWhatsapp] = useState(siteSettings?.whatsapp)
  const [viber, setViber] = useState(siteSettings?.viber)
  const [telegram, setTelegram] = useState(siteSettings?.telegram)
  const [instagram, setInstagram] = useState(siteSettings?.instagram)
  const [vk, setVk] = useState(siteSettings?.vk)
  const [email, setEmail] = useState(siteSettings?.email)

  const router = useRouter()

  const refreshPage = () => {
    router.replace(router.asPath)
  }

  const formChanged =
    siteSettings?.phone !== phone ||
    siteSettings?.whatsapp !== whatsapp ||
    siteSettings?.viber !== viber ||
    siteSettings?.telegram !== telegram ||
    siteSettings?.instagram !== instagram ||
    siteSettings?.vk !== vk ||
    siteSettings?.email !== email

  const handleSubmit = async () => {
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
      refreshPage
    )
  }

  return (
    <div className="flex flex-col h-screen px-2 mb-2 gap-y-2">
      <FormWrapper>
        <FormWrapper twoColumns>
          <PhoneInput
            label="Телефон"
            value={phone}
            onChange={setPhone}
            copyPasteButtons
          />
          <PhoneInput
            label="Whatsapp"
            value={whatsapp}
            onChange={setWhatsapp}
            copyPasteButtons
          />
        </FormWrapper>
        <FormWrapper twoColumns>
          <PhoneInput
            label="Viber"
            value={viber}
            onChange={setViber}
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
      </FormWrapper>

      <Button name="Применить" disabled={!formChanged} onClick={handleSubmit} />
    </div>
  )
}

export default ContactsContent
