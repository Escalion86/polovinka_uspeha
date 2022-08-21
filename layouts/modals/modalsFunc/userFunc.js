import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'

import { useRecoilValue } from 'recoil'
import userSelector from '@state/selectors/userSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

import Input from '@components/Input'
import FormWrapper from '@components/FormWrapper'
// import InputImage from '@components/InputImage'
import DatePicker from '@components/DatePicker'
import PhoneInput from '@components/PhoneInput'
// import OrientationPicker from '@components/ValuePicker/OrientationPicker'
import GenderPicker from '@components/ValuePicker/GenderPicker'
import ErrorsList from '@components/ErrorsList'
import UserStatusPicker from '@components/ValuePicker/UserStatusPicker'
import validateEmail from '@helpers/validateEmail'
import InputImages from '@components/InputImages'
import CheckBox from '@components/CheckBox'

const userFunc = (userId, clone = false) => {
  const UserModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    const user = useRecoilValue(userSelector(userId))
    const setUser = useRecoilValue(itemsFuncAtom).user.set

    const [firstName, setFirstName] = useState(user?.firstName ?? '')
    const [secondName, setSecondName] = useState(user?.secondName ?? '')
    const [thirdName, setThirdName] = useState(user?.thirdName ?? '')
    // const [about, setAbout] = useState(user?.about ?? '')
    // const [interests, setInterests] = useState(user?.interests ?? '')
    // const [profession, setProfession] = useState(user?.profession ?? '')
    // const [orientation, setOrientation] = useState(user?.orientation ?? '')
    const [gender, setGender] = useState(user?.gender ?? null)
    const [email, setEmail] = useState(user?.email ?? '')
    const [phone, setPhone] = useState(user?.phone ?? '')
    const [whatsapp, setWhatsapp] = useState(user?.whatsapp ?? '')
    const [viber, setViber] = useState(user?.viber ?? '')
    const [telegram, setTelegram] = useState(user?.telegram ?? '')
    const [instagram, setInstagram] = useState(user?.instagram ?? '')
    const [vk, setVk] = useState(user?.vk ?? '')
    const [images, setImages] = useState(user?.images ?? [])
    const [birthday, setBirthday] = useState(user?.birthday ?? '')
    const [status, setStatus] = useState(user?.status ?? 'novice')

    const [haveKids, setHaveKids] = useState(user?.haveKids ?? false)

    const [errors, addError, removeError, clearErrors] = useErrors()

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {
      clearErrors()
      let error = false
      if (!firstName) {
        addError({ firstName: 'Необходимо ввести имя' })
        error = true
      }
      if (!secondName) {
        addError({ secondName: 'Необходимо ввести фамилию' })
        error = true
      }
      if (!gender) {
        addError({ gender: 'Необходимо ввести пол' })
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
        closeModal()
        setUser(
          {
            _id: user?._id,
            firstName,
            secondName,
            thirdName,
            // about,
            // interests,
            // profession,
            // orientation,
            gender,
            email,
            phone,
            whatsapp,
            viber,
            telegram,
            instagram,
            vk,
            images,
            birthday,
            status,
            haveKids,
          },
          clone
        )
        // if (user && !clone) {
        //   await putData(
        //     `/api/users/${user._id}`,
        //     {
        //       name,
        //       secondName,
        //       thirdName,
        //       about,
        //       interests,
        //       profession,
        //       orientation,
        //       gender,
        //       phone,
        //       whatsapp,
        //       viber,
        //       telegram,
        //       instagram,
        //       vk,
        //       image,
        //       birthday,
        //     },
        //     refreshPage
        //   )
        // } else {
        //   await postData(
        //     `/api/users`,
        //     {
        //       name,
        //       secondName,
        //       thirdName,
        //       about,
        //       interests,
        //       profession,
        //       orientation,
        //       gender,
        //       phone,
        //       whatsapp,
        //       viber,
        //       telegram,
        //       instagram,
        //       vk,
        //       image,
        //       birthday,
        //     },
        //     refreshPage
        //   )
        // }
      }
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [
      firstName,
      secondName,
      thirdName,
      // about,
      // interests,
      // profession,
      // orientation,
      gender,
      email,
      phone,
      whatsapp,
      viber,
      telegram,
      instagram,
      vk,
      images,
      birthday,
      status,
      haveKids,
    ])

    return (
      <FormWrapper>
        {/* <InputImage
          label="Фотография"
          directory="users"
          image={image}
          onChange={setImage}
        /> */}
        <InputImages
          label="Фотографии"
          directory="users"
          images={images}
          onChange={(images) => {
            removeError('images')
            setImages(images)
          }}
          // required
          error={errors.images}
        />
        <Input
          label="Имя"
          type="text"
          value={firstName}
          onChange={(value) => {
            removeError('firstName')
            setFirstName(value)
          }}
          // labelClassName="w-40"
          error={errors.firstName}
          forGrid
          required
        />
        <Input
          label="Фамилия"
          type="text"
          value={secondName}
          onChange={(value) => {
            removeError('secondName')
            setSecondName(value)
          }}
          // labelClassName="w-40"
          error={errors.secondName}
          forGrid
          required
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
        <GenderPicker
          required
          gender={gender}
          onChange={setGender}
          error={errors.gender}
        />
        {/* <OrientationPicker
          orientation={orientation}
          onChange={setOrientation}
        /> */}
        <DatePicker
          label="День рождения"
          value={birthday}
          onChange={setBirthday}
          showYears
          showZodiac
          required
          error={errors.birthday}
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
        <Input
          label="Email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          copyPasteButtons
        />
        <CheckBox
          checked={haveKids}
          labelPos="left"
          onClick={() => setHaveKids((checked) => !checked)}
          label="Есть дети"
        />
        <UserStatusPicker
          required
          status={status}
          onChange={setStatus}
          error={errors.status}
        />
        {/* <Textarea label="Обо мне" value={about} onChange={setAbout} rows={4} />
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
        /> */}
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${userId && !clone ? 'Редактирование' : 'Создание'} пользователя`,
    confirmButtonName: userId && !clone ? 'Применить' : 'Создать',
    Children: UserModal,
  }
}

export default userFunc
