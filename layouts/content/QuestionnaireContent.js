import Button from '@components/Button'
import DatePicker from '@components/DatePicker'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
// import InputImage from '@components/InputImage'
import InputImages from '@components/InputImages'
import PhoneInput from '@components/PhoneInput'
import GenderPicker from '@components/ValuePicker/GenderPicker'
// import OrientationPicker from '@components/ValuePicker/OrientationPicker'
import { putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import validateEmail from '@helpers/validateEmail'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

// TODO Сделать правильное обновление страницы (а не полную перезагрузку), а также добавить редактирование Email
const QuestionnaireContent = (props) => {
  // const user = props.loggedUser
  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom)
  const [firstName, setFirstName] = useState(loggedUser?.firstName ?? '')
  const [secondName, setSecondName] = useState(loggedUser?.secondName ?? '')
  const [thirdName, setThirdName] = useState(loggedUser?.thirdName ?? '')
  // const [about, setAbout] = useState(user?.about ?? '')
  // const [interests, setInterests] = useState(user?.interests ?? '')
  // const [profession, setProfession] = useState(user?.profession ?? '')
  // const [orientation, setOrientation] = useState(user?.orientation ?? '')
  const [gender, setGender] = useState(loggedUser?.gender ?? null)
  const [email, setEmail] = useState(loggedUser?.email ?? '')
  const [phone, setPhone] = useState(loggedUser?.phone ?? '')
  const [whatsapp, setWhatsapp] = useState(loggedUser?.whatsapp ?? '')
  const [viber, setViber] = useState(loggedUser?.viber ?? '')
  const [telegram, setTelegram] = useState(loggedUser?.telegram ?? '')
  const [instagram, setInstagram] = useState(loggedUser?.instagram ?? '')
  const [vk, setVk] = useState(loggedUser?.vk ?? '')
  const [images, setImages] = useState(loggedUser?.images ?? [])
  const [birthday, setBirthday] = useState(loggedUser?.birthday ?? '')

  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [errors, addError, removeError, clearErrors] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)
  const [message, setMessage] = useState('')

  const router = useRouter()

  const refreshPage = () => {
    router.replace(router.asPath)
  }

  const formChanged =
    loggedUser?.firstName !== firstName ||
    loggedUser?.secondName !== secondName ||
    loggedUser?.thirdName !== thirdName ||
    // user?.about !== about ||
    // user?.interests !== interests ||
    // user?.profession !== profession ||
    // user?.orientation !== orientation ||
    loggedUser?.gender !== gender ||
    loggedUser?.email !== email ||
    loggedUser?.phone !== phone ||
    loggedUser?.whatsapp !== whatsapp ||
    loggedUser?.viber !== viber ||
    loggedUser?.telegram !== telegram ||
    loggedUser?.instagram !== instagram ||
    loggedUser?.vk !== vk ||
    loggedUser?.images !== images ||
    loggedUser?.birthday !== birthday

  const onClickConfirm = async () => {
    clearErrors()
    setMessage('')
    let error = false
    // if (!name) {
    //   addError({ name: 'Необходимо ввести имя' })
    //   error = true
    // }
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
      setIsWaitingToResponse(true)
      await putData(
        `/api/users/${loggedUser._id}`,
        {
          name,
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
        },
        (data) => {
          setLoggedUser(data)
          setMessage('Данные анкеты обновлены успешно')
          setIsWaitingToResponse(false)
          // refreshPage()
        },
        () => {
          setMessage('')
          addError({ response: 'Ошибка обновления данных' })
          setIsWaitingToResponse(false)
        }
      )
      // setIsWaitingToResponse(false)
    }
  }

  useEffect(() => {
    if (isWaitingToResponse) {
      setIsWaitingToResponse(false)
      // setMessage('Данные анкеты обновлены успешно')
    }
  }, [props])

  useEffect(() => {
    if (!firstName || !secondName || !phone || !gender) {
      typeof modalsFunc.add === 'function' &&
        modalsFunc.add({
          id: 'questionnaireNotFilled',
          title: 'Необходимо заполнить анкету',
          text: (
            <>
              <span>
                Для возможности записи на мероприятия необходимо заполнить
                обязательные поля анкеты:
              </span>
              <ul className="ml-4 list-disc">
                <li>Имя</li>
                <li>Фамилия</li>
                <li>Дата рождения</li>
                <li>Пол</li>
              </ul>
            </>
          ),
          onConfirm: () => {},
          confirmButtonName: 'Хорошо',
          showDecline: false,
        })
    }
  }, [modalsFunc])

  return (
    <div className="flex flex-col h-screen px-2 mb-2 gap-y-2">
      <FormWrapper>
        {/* <InputImage
          label="Фотография"
          directory="users"
          image={image}
          onChange={setImage}
          noImage={image ?? `/img/users/${gender ?? 'male'}.jpg`}
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
          required
          // labelClassName="w-40"
          error={errors.firstName}
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
        <GenderPicker
          required
          gender={gender}
          onChange={(value) => {
            removeError('gender')
            setGender(value)
          }}
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
        />

        <FormWrapper twoColumns>
          <PhoneInput
            required
            label="Телефон (логин)"
            value={phone}
            onChange={setPhone}
            error={errors.phone}
            copyPasteButtons
            disabled
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
      </FormWrapper>
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
  )
}

export default QuestionnaireContent
