import Button from '@components/Button'
import DatePicker from '@components/DatePicker'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImage from '@components/InputImage'
import PhoneInput from '@components/PhoneInput'
import Textarea from '@components/Textarea'
import GenderPicker from '@components/ValuePicker/GenderPicker'
import OrientationPicker from '@components/ValuePicker/OrientationPicker'
import { putData } from '@helpers/CRUD'
import getZodiac from '@helpers/getZodiac'
import useErrors from '@helpers/useErrors'
import { useRouter } from 'next/router'
import { useState } from 'react'

// TODO Сделать правильное обновление страницы (а не полную перезагрузку), а также добавить редактирование Email
const QuestionnaireContent = (props) => {
  const user = props.loggedUser
  const [name, setName] = useState(user?.name)
  const [secondName, setSecondName] = useState(user?.secondName)
  const [thirdName, setThirdName] = useState(user?.thirdName)
  const [about, setAbout] = useState(user?.about)
  const [interests, setInterests] = useState(user?.interests)
  const [profession, setProfession] = useState(user?.profession)
  const [orientation, setOrientation] = useState(user?.orientation)
  const [gender, setGender] = useState(user?.gender)
  const [email, setEmail] = useState(user ? user?.email : '')
  const [phone, setPhone] = useState(user?.phone)
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp)
  const [viber, setViber] = useState(user?.viber)
  const [telegram, setTelegram] = useState(user?.telegram)
  const [instagram, setInstagram] = useState(user?.instagram)
  const [vk, setVk] = useState(user?.vk)
  const [image, setImage] = useState(user?.image)
  const [birthday, setBirthday] = useState(user?.birthday)

  const [errors, addError, removeError, clearErrors] = useErrors()

  const router = useRouter()

  const refreshPage = () => {
    router.replace(router.asPath)
  }

  const formChanged =
    user?.name !== name ||
    user?.secondName !== secondName ||
    user?.thirdName !== thirdName ||
    user?.about !== about ||
    user?.interests !== interests ||
    user?.profession !== profession ||
    user?.orientation !== orientation ||
    user?.gender !== gender ||
    user?.email !== email ||
    user?.phone !== phone ||
    user?.whatsapp !== whatsapp ||
    user?.viber !== viber ||
    user?.telegram !== telegram ||
    user?.instagram !== instagram ||
    user?.vk !== vk ||
    user?.image !== image ||
    user?.birthday !== birthday

  const onClickConfirm = async () => {
    clearErrors()
    let error = false
    if (!name) {
      addError({ name: 'Необходимо ввести имя' })
      error = true
    }
    if (!secondName) {
      addError({ secondName: 'Необходимо ввести фамилию' })
      error = true
    }
    if (!gender) {
      addError({ phone: 'Необходимо ввести пол' })
      error = true
    }
    if (!phone) {
      addError({ phone: 'Необходимо ввести телефон' })
      error = true
    } else if (phone && `${phone}`.length !== 11) {
      addError({ phone: 'Некорректно введен номер телефона' })
      error = true
    }
    if (viber && `${viber}`.length !== 11) {
      addError({ viber: 'Некорректно введен номер viber' })
      error = true
    }
    if (whatsapp && `${whatsapp}`.length !== 11) {
      addError({ whatsapp: 'Некорректно введен номер whatsapp' })
      error = true
    }
    if (email && !validateEmail(email)) {
      addError({ whatsapp: 'Некорректно введен email' })
      error = true
    }
    if (!birthday) {
      addError({ birthday: 'Необходимо ввести дату рождения' })
      error = true
    }
    if (!error) {
      await putData(
        `/api/users/${user._id}`,
        {
          name,
          secondName,
          thirdName,
          about,
          interests,
          profession,
          orientation,
          gender,
          email,
          phone,
          whatsapp,
          viber,
          telegram,
          instagram,
          vk,
          image,
          birthday,
        },
        refreshPage
      )
    }
  }

  return (
    <div className="flex flex-col h-screen px-2 mb-2 gap-y-2">
      <FormWrapper>
        <InputImage
          label="Фотография"
          directory="users"
          image={image}
          onChange={setImage}
        />
        <Input
          label="Имя"
          type="text"
          value={name}
          onChange={(value) => {
            removeError('name')
            setName(value)
          }}
          required
          // labelClassName="w-40"
          error={errors.name}
          forGrid
        />
        <Input
          label="Фамилия"
          type="text"
          value={secondName}
          onChange={(value) => {
            removeError('secondName')
            setSecondName(value)
          }}
          required
          // labelClassName="w-40"
          error={errors.secondName}
          forGrid
        />
        <Input
          label="Отчество"
          type="text"
          value={thirdName}
          onChange={(value) => {
            removeError('thirdName')
            setThirdName(value)
          }}
          // labelClassName="w-40"
          error={errors.thirdName}
          forGrid
        />
        <GenderPicker required gender={gender} onChange={setGender} />
        <OrientationPicker
          orientation={orientation}
          onChange={setOrientation}
        />
        <Input
          label="Email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          copyPasteButtons
        />
        <FormWrapper twoColumns>
          <PhoneInput
            required
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
        <DatePicker
          label="День рождения"
          value={birthday}
          onChange={setBirthday}
          showYears
          showZodiac
          required
        />
        <Textarea label="Обо мне" value={about} onChange={setAbout} rows={4} />
        <Textarea
          label="Профессия"
          value={profession}
          onChange={setProfession}
          rows={4}
        />
        <Textarea
          label="Интересы"
          value={interests}
          onChange={setInterests}
          rows={4}
        />
      </FormWrapper>
      <ErrorsList errors={errors} />
      <Button
        name="Применить"
        disabled={!formChanged}
        onClick={onClickConfirm}
      />
    </div>
  )
}

export default QuestionnaireContent
