import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import DatePicker from '@components/DatePicker'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
// import InputImage from '@components/InputImage'
import InputImages from '@components/InputImages'
import PhoneInput from '@components/PhoneInput'
import GenderPicker from '@components/ValuePicker/GenderPicker'
import HaveKidsPicker from '@components/ValuePicker/HaveKidsPicker'
import compareArrays from '@helpers/compareArrays'
import { DEFAULT_USER } from '@helpers/constants'
// import OrientationPicker from '@components/ValuePicker/OrientationPicker'
import { putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
// import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react'
import YesNoPicker from '@components/ValuePicker/YesNoPicker'
import compareObjects from '@helpers/compareObjects'
import ValuePicker from '@components/ValuePicker/ValuePicker'

// TODO Сделать правильное обновление страницы (а не полную перезагрузку), а также добавить редактирование Email
const QuestionnaireContent = (props) => {
  // const user = props.loggedUser
  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom)
  const [firstName, setFirstName] = useState(
    loggedUser?.firstName ?? DEFAULT_USER.firstName
  )
  const [secondName, setSecondName] = useState(
    loggedUser?.secondName ?? DEFAULT_USER.secondName
  )
  const [thirdName, setThirdName] = useState(
    loggedUser?.thirdName ?? DEFAULT_USER.thirdName
  )
  // const [about, setAbout] = useState(user?.about ?? '')
  // const [interests, setInterests] = useState(user?.interests ?? '')
  // const [profession, setProfession] = useState(user?.profession ?? '')
  // const [orientation, setOrientation] = useState(user?.orientation ?? DEFAULT_USER.orientation)
  const [gender, setGender] = useState(
    loggedUser?.gender ?? DEFAULT_USER.gender
  )
  const [email, setEmail] = useState(loggedUser?.email ?? DEFAULT_USER.email)
  const [phone, setPhone] = useState(loggedUser?.phone ?? DEFAULT_USER.phone)
  const [whatsapp, setWhatsapp] = useState(
    loggedUser?.whatsapp ?? DEFAULT_USER.whatsapp
  )
  const [viber, setViber] = useState(loggedUser?.viber ?? DEFAULT_USER.viber)
  const [telegram, setTelegram] = useState(
    loggedUser?.telegram ?? DEFAULT_USER.telegram
  )
  const [instagram, setInstagram] = useState(
    loggedUser?.instagram ?? DEFAULT_USER.instagram
  )
  const [vk, setVk] = useState(loggedUser?.vk ?? DEFAULT_USER.vk)
  const [images, setImages] = useState(
    loggedUser?.images ?? DEFAULT_USER.images
  )
  const [birthday, setBirthday] = useState(
    loggedUser?.birthday ?? DEFAULT_USER.birthday
  )

  const [haveKids, setHaveKids] = useState(
    loggedUser?.haveKids ?? DEFAULT_USER.haveKids
  )

  const [security, setSecurity] = useState(
    loggedUser?.security ?? DEFAULT_USER.security
  )

  const toggleSecurytyKey = (key) =>
    setSecurity((state) => {
      return { ...state, [key]: !state[key] }
    })

  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)
  const [message, setMessage] = useState('')

  // const router = useRouter()

  // const refreshPage = () => {
  //   router.replace(router.asPath)
  // }

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
    !compareArrays(loggedUser?.images, images) ||
    loggedUser?.birthday !== birthday ||
    loggedUser?.haveKids !== haveKids ||
    !compareObjects(loggedUser?.security, security)
  console.log(
    'compareObjects(loggedUser?.security, security)',
    compareObjects(loggedUser?.security, security)
  )

  const onClickConfirm = async () => {
    setMessage('')
    if (
      !checkErrors({
        firstName,
        secondName,
        gender,
        phone,
        viber,
        whatsapp,
        email,
        birthday,
      })
    ) {
      setIsWaitingToResponse(true)
      await putData(
        `/api/users/${loggedUser._id}`,
        {
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
          haveKids,
          security,
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
    <div className="flex flex-col w-full h-full max-h-full min-h-full">
      <Tabs
        className="flex flex-col flex-1"
        id="custom-animation"
        value="general"
      >
        <TabsHeader
          // indicatorProps={{ className: 'duration-0 bg-general h-1 top-8' }}
          className="bg-gray-200 duration-0"
        >
          <Tab key="general" value="general" className="flex flex-col">
            Анкета
          </Tab>
          <Tab key="security" value="security" className="flex flex-col">
            Безопасность
          </Tab>
        </TabsHeader>
        <TabsBody
          animate={{
            mount: { scale: 1 },
            unmount: { scale: 0 },
          }}
          className="flex-1"
        >
          <TabPanel
            value="general"
            className="h-full max-h-full overflow-y-auto"
          >
            {/* <div className="flex flex-col flex-1 max-h-full px-2 mb-2 gap-y-2"> */}
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
              <HaveKidsPicker haveKids={haveKids} onChange={setHaveKids} />
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
            {/* </div> */}
          </TabPanel>
          <TabPanel
            value="security"
            className="flex flex-col h-full max-h-full overflow-y-auto gap-y-2"
          >
            <FormWrapper>
              <ValuePicker
                value={security.fullSecondName}
                valuesArray={[
                  { value: true, name: 'Полностью', color: 'green-400' },
                  {
                    value: false,
                    name: 'Только первую букву',
                    color: 'blue-400',
                  },
                ]}
                label="Показывать фамилию"
                onChange={() => toggleSecurytyKey('fullSecondName')}
                name="yes_no"
                // inLine
              />
              <ValuePicker
                value={security.fullThirdName}
                valuesArray={[
                  { value: true, name: 'Полностью', color: 'green-400' },
                  {
                    value: false,
                    name: 'Только первую букву',
                    color: 'blue-400',
                  },
                ]}
                label="Показывать отчество"
                onChange={() => toggleSecurytyKey('fullThirdName')}
                name="yes_no"
                // inLine
              />
              <YesNoPicker
                label="Показывать дату рождения"
                // inLine
                value={security.showBirthday}
                onChange={() => toggleSecurytyKey('showBirthday')}
              />
              <YesNoPicker
                label="Показывать возраст"
                // inLine
                value={security.showAge}
                onChange={() => toggleSecurytyKey('showAge')}
              />
              <YesNoPicker
                label="Показывать контакты (телефон и пр.)"
                // inLine
                value={security.showContacts}
                onChange={() => toggleSecurytyKey('showContacts')}
              />
            </FormWrapper>
            {/* </FormWrapper> */}
          </TabPanel>
        </TabsBody>
      </Tabs>
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

export default QuestionnaireContent
