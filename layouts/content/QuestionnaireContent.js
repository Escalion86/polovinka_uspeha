import Button from '@components/Button'
// import CheckBox from '@components/CheckBox'
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
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import YesNoPicker from '@components/ValuePicker/YesNoPicker'
import compareObjects from '@helpers/compareObjects'
import ValuePicker from '@components/ValuePicker/ValuePicker'

import TabPanel from '@components/Tabs/TabPanel'
import TabContext from '@components/Tabs/TabContext'
import userEditSelector from '@state/selectors/userEditSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import UserRolePicker from '@components/ValuePicker/UserRolePicker'
import UserStatusPicker from '@components/ValuePicker/UserStatusPicker'
import useSnackbar from '@helpers/useSnackbar'
import ValueItem from '@components/ValuePicker/ValueItem'
import {
  faBan,
  faCheck,
  faStop,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'

// TODO Сделать правильное обновление страницы (а не полную перезагрузку), а также добавить редактирование Email
const QuestionnaireContent = (props) => {
  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom)
  const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  const setUserInUsersState = useSetRecoilState(userEditSelector)
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

  const [notifications, setNotifications] = useState(
    loggedUser?.notifications ?? DEFAULT_USER.notifications
  )

  const [status, setStatus] = useState(
    loggedUser?.status ?? DEFAULT_USER.status
  )
  const [role, setRole] = useState(loggedUser?.role ?? DEFAULT_USER.role)

  const toggleSecurytyKey = (key) =>
    setSecurity((state) => {
      return { ...state, [key]: !state[key] }
    })

  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)

  const { success, error } = useSnackbar()

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
    // loggedUser?.phone !== phone ||
    loggedUser?.whatsapp !== whatsapp ||
    loggedUser?.viber !== viber ||
    loggedUser?.telegram !== telegram ||
    loggedUser?.instagram !== instagram ||
    loggedUser?.vk !== vk ||
    !compareArrays(loggedUser?.images, images) ||
    loggedUser?.birthday !== birthday ||
    loggedUser?.haveKids !== haveKids ||
    !compareObjects(loggedUser?.security, security) ||
    loggedUser?.status !== status ||
    loggedUser?.role !== role ||
    loggedUser?.notifications?.telegram?.userName !==
      notifications?.telegram?.userName ||
    loggedUser?.notifications?.telegram?.active !==
      notifications?.telegram?.active

  const onClickConfirm = async () => {
    if (notifications?.telegram?.active && !notifications?.telegram?.userName) {
      addError({
        notificationTelegramUserName:
          'Введите имя пользователя Telegram для оповещений',
      })
    } else if (
      !checkErrors({
        firstName: firstName.trim(),
        secondName: secondName.trim(),
        gender,
        // phone,
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
          firstName: firstName.trim(),
          secondName: secondName.trim(),
          thirdName: thirdName.trim(),
          // about,
          // interests,
          // profession,
          // orientation,
          gender,
          email,
          // phone,
          whatsapp,
          viber,
          telegram,
          instagram,
          vk,
          images,
          birthday,
          haveKids,
          security,
          status,
          role,
          notifications,
        },
        (data) => {
          setLoggedUser(data)
          setUserInUsersState(data)
          success('Данные анкеты обновлены успешно')
          setIsWaitingToResponse(false)
          // refreshPage()
        },
        () => {
          error('Ошибка обновления данных')
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
    if (
      modalsFunc &&
      typeof modalsFunc.add === 'function' &&
      (!firstName || !secondName || !gender)
    ) {
      modalsFunc.add({
        uid: 'questionnaireNotFilled',
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
    <div className="flex flex-col flex-1 h-full max-w-full max-h-full min-h-full">
      <TabContext value="Анкета">
        <TabPanel tabName="Анкета" className="flex-1">
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
                setFirstName(value.trim())
              }}
              required
              // labelClassName="w-40"
              error={errors.firstName}
            />
            <Input
              label="Фамилия"
              type="text"
              value={secondName}
              onChange={(value) => {
                removeError('secondName')
                setSecondName(value.trim())
              }}
              required
              // labelClassName="w-40"
              error={errors.secondName}
            />
            <Input
              label="Отчество"
              type="text"
              value={thirdName}
              onChange={(value) => {
                removeError('thirdName')
                setThirdName(value.trim())
              }}
              // labelClassName="w-40"
              error={errors.thirdName}
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
              error={errors.birthday}
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
          </FormWrapper>
          {isLoggedUserDev && (
            <ValueItem
              name="Доп анкета"
              color="green-500"
              icon={faCheck}
              hoverable
              onClick={() => modalsFunc.user.questionnaire()}
            />
          )}
          {isLoggedUserDev && (
            <ValueItem
              name="Конструктор анкет"
              color="red-500"
              icon={faCheck}
              hoverable
              onClick={() => modalsFunc.questionnaire.edit()}
            />
          )}
          {/* </div> */}
        </TabPanel>
        <TabPanel tabName="Конфиденциальность" className="flex-1 p-2">
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
        {(isLoggedUserAdmin || isLoggedUserDev) && (
          <TabPanel tabName="Статус и права" className="flex-1">
            {isLoggedUserAdmin && (
              <UserStatusPicker
                required
                status={status}
                onChange={setStatus}
                error={errors.status}
              />
            )}
            {isLoggedUserDev && (
              <UserRolePicker
                required
                role={role}
                onChange={setRole}
                error={errors.role}
              />
            )}
          </TabPanel>
        )}
        {(isLoggedUserAdmin || isLoggedUserDev) && (
          <TabPanel tabName="Оповещения" className="flex-1">
            <YesNoPicker
              label="Оповещения в Telegram"
              // inLine
              value={notifications?.telegram?.active ?? false}
              onChange={() => {
                removeError('notificationTelegramUserName')
                setNotifications((state) => ({
                  ...state,
                  telegram: {
                    ...notifications?.telegram,
                    active: !notifications?.telegram?.active,
                  },
                }))
              }}
            />
            {notifications?.telegram?.active && (
              <>
                {/* <Input
                  prefix="@"
                  label="Имя пользователя Telegram"
                  type="text"
                  value={notifications?.telegram?.userName}
                  onChange={(value) => {
                    removeError('notificationTelegramUserName')
                    setNotifications((state) => ({
                      ...state,
                      telegram: {
                        ...notifications?.telegram,
                        userName: value,
                      },
                    }))
                  }}
                  copyPasteButtons
                  required
                  // labelClassName="w-40"
                  error={errors.notificationTelegramUserName}
                /> */}
                <div className="flex flex-col flex-wrap tablet:items-center tablet:flex-row gap-x-1">
                  <span className="whitespace-nowrap">
                    Статус подключения Telegram:
                  </span>
                  {notifications?.telegram?.id ? (
                    <>
                      <div className="flex gap-x-1">
                        <span className="text-success">АКТИВНО</span>
                        <span className="">{`(@${notifications?.telegram?.userName})`}</span>
                      </div>
                      <ValueItem
                        name="Деактивировать"
                        color="red-500"
                        icon={faBan}
                        hoverable
                        // onClick={() => modalsFunc.notifications.telegram()}
                      />
                    </>
                  ) : (
                    <>
                      <span className="text-danger">НЕ АКТИВНО</span>
                      <ValueItem
                        name="Активировать"
                        color="green-500"
                        icon={faCheck}
                        hoverable
                        onClick={() => modalsFunc.notifications.telegram()}
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </TabPanel>
        )}
      </TabContext>
      <div className="flex flex-col w-full p-1">
        <ErrorsList errors={errors} />
        <Button
          name="Применить"
          disabled={!formChanged}
          onClick={onClickConfirm}
          loading={isWaitingToResponse}
        />
      </div>
    </div>
  )
}

export default QuestionnaireContent
