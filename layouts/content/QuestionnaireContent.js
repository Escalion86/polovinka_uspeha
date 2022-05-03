import Button from '@components/Button'
import DatePicker from '@components/DatePicker'
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

const QuestionnaireContent = (props) => {
  const user = props.loggedUser
  const [name, setName] = useState(user?.name)
  const [secondname, setSecondname] = useState(user?.secondname)
  const [thirdname, setThirdname] = useState(user?.thirdname)
  const [about, setAbout] = useState(user?.about)
  const [interests, setInterests] = useState(user?.interests)
  const [profession, setProfession] = useState(user?.profession)
  const [orientation, setOrientation] = useState(user?.orientation)
  const [gender, setGender] = useState(user?.gender)
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
    user?.secondname !== secondname ||
    user?.thirdname !== thirdname ||
    user?.about !== about ||
    user?.interests !== interests ||
    user?.profession !== profession ||
    user?.orientation !== orientation ||
    user?.gender !== gender ||
    user?.phone !== phone ||
    user?.whatsapp !== whatsapp ||
    user?.viber !== viber ||
    user?.telegram !== telegram ||
    user?.instagram !== instagram ||
    user?.vk !== vk ||
    user?.image !== image ||
    user?.birthday !== birthday

  const handleSubmit = async () => {
    await putData(
      `/api/users/${user._id}`,
      {
        name,
        secondname,
        thirdname,
        about,
        interests,
        profession,
        orientation,
        gender,
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

  return (
    <>
      <div className="flex flex-col px-2 gap-y-2">
        <FormWrapper>
          <InputImage
            label="Картинка"
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
            // labelClassName="w-40"
            error={errors.name}
            forGrid
          />
          <Input
            label="Фамилия"
            type="text"
            value={secondname}
            onChange={(value) => {
              removeError('secondname')
              setSecondname(value)
            }}
            // labelClassName="w-40"
            error={errors.secondname}
            forGrid
          />
          <Input
            label="Отчество"
            type="text"
            value={thirdname}
            onChange={(value) => {
              removeError('thirdname')
              setThirdname(value)
            }}
            // labelClassName="w-40"
            error={errors.thirdname}
            forGrid
          />
          <GenderPicker gender={gender} onChange={setGender} />
          <OrientationPicker
            orientation={orientation}
            onChange={setOrientation}
          />
          <FormWrapper twoColumns>
            <PhoneInput label="Телефон" value={phone} onChange={setPhone} />
            <PhoneInput
              label="Whatsapp"
              value={whatsapp}
              onChange={setWhatsapp}
            />
          </FormWrapper>
          <FormWrapper twoColumns>
            <PhoneInput label="Viber" value={viber} onChange={setViber} />
            <Input
              prefix="@"
              label="Telegram"
              value={telegram}
              onChange={setTelegram}
            />
          </FormWrapper>
          <FormWrapper twoColumns>
            <Input
              prefix="@"
              label="Instagram"
              value={instagram}
              onChange={setInstagram}
            />
            <Input prefix="@" label="Vk" value={vk} onChange={setVk} />
          </FormWrapper>
          <DatePicker
            label="День рождения"
            value={birthday}
            onChange={setBirthday}
            showYears
            showZodiac
          />
          <Textarea
            label="Обо мне"
            value={about}
            onChange={setAbout}
            rows={4}
          />
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

        <Button
          name="Применить"
          disabled={!formChanged}
          onClick={handleSubmit}
        />
      </div>
    </>
  )
}

export default QuestionnaireContent
