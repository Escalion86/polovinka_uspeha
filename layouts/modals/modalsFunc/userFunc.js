import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import React, { useEffect, useState } from 'react'
import EditableTextarea from '@components/EditableTextarea'
import { useRouter } from 'next/router'
import FormWrapper from '@components/FormWrapper'
import InputImage from '@components/InputImage'
import Textarea from '@components/Textarea'
import DatePicker from '@components/DatePicker'
import PhoneInput from '@components/PhoneInput'
import OrientationPicker from '@components/ValuePicker/OrientationPicker'
import GenderPicker from '@components/ValuePicker/GenderPicker'

const userFunc = (user) => {
  const isEditing = !!user

  const UserModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
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

    const onClickConfirm = async () => {
      let error = false
      // if (!title) {
      //   addError({ title: 'Необходимо ввести название' })
      //   error = true
      // }
      // if (!description) {
      //   addError({ description: 'Необходимо ввести описание' })
      //   error = true
      // }
      if (!error) {
        if (isEditing) {
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
        } else {
          await postData(
            `/api/users`,
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
        closeModal()
      }
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [
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
    ])

    return (
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
        {Object.values(errors).length > 0 && (
          <div className="flex flex-col text-red-500">
            {Object.values(errors).map((error) => (
              <div key={error}>{error}</div>
            ))}
          </div>
        )}
      </FormWrapper>
    )
  }

  return {
    title: `${isEditing ? 'Редактирование' : 'Создание'} пользователя`,
    confirmButtonName: isEditing ? 'Применить' : 'Создать',
    Children: UserModal,
  }
}

export default userFunc
