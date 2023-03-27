import Button from '@components/Button'
import DatePicker from '@components/DatePicker'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImages from '@components/InputImages'
import PhoneInput from '@components/PhoneInput'
import GenderPicker from '@components/ValuePicker/GenderPicker'
import HaveKidsPicker from '@components/ValuePicker/HaveKidsPicker'
import compareArrays from '@helpers/compareArrays'
import { DEFAULT_USER } from '@helpers/constants'
import { putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
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
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons'
import ChipsSelector from '@components/ChipsSelector'
import upperCaseFirst from '@helpers/upperCaseFirst'

const items = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
]

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

  const [interests, setInterests] = useState([])
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

  const setSecurytyKey = (data) =>
    setSecurity((state) => {
      return { ...state, ...data }
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
        thirdName: thirdName.trim(),
        gender,
        // phone,
        viber,
        whatsapp,
        email,
        birthday,
        security,
        images,
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
        },
        false,
        loggedUser._id
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
      (!firstName ||
        !secondName ||
        !birthday ||
        !gender ||
        !images ||
        images.length === 0)
    ) {
      modalsFunc.add({
        uid: 'questionnaireNotFilled',
        title: 'Необходимо заполнить анкету',
        text: (
          <>
            <span>
              {
                'Для возможности записи на мероприятия необходимо заполнить обязательные поля анкеты:'
              }
            </span>
            <ul className="ml-4 list-disc">
              {!loggedUser.firstName && (
                <li className="font-bold text-red-500">Имя</li>
              )}
              {!loggedUser.secondName && (
                <li className="font-bold text-red-500">Фамилия</li>
              )}
              {!loggedUser.birthday && (
                <li className="font-bold text-red-500">Дата рождения</li>
              )}
              {!loggedUser.gender && (
                <li className="font-bold text-red-500">Пол</li>
              )}
              {(!loggedUser.images || loggedUser.images.length === 0) && (
                <li className="font-bold text-red-500">
                  {'Фотографии (добавьте хотя бы одно фото)'}
                </li>
              )}
            </ul>
            <span>
              {
                'Пожалуйста заполните поля честно! Во вкладке "конфиденциальность" вы можете скрыть те данные, которые не хотели бы показывать другим.'
              }
            </span>
          </>
        ),
        onConfirm: () => {},
        confirmButtonName: 'Хорошо',
        showDecline: false,
      })
    }
  }, [modalsFunc])

  const buttonDisabled = !formChanged || loggedUser.status === 'ban'

  return (
    <div className="flex flex-col flex-1 h-full max-w-full max-h-full min-h-full">
      <div className="flex items-center w-full p-1 gap-x-1">
        <div className="flex flex-row-reverse flex-1">
          {!buttonDisabled && (
            <span className="leading-4 text-right tablet:text-lg">
              Чтобы изменения вступили в силу нажмите:
            </span>
          )}
        </div>
        <Button
          // classBgColor=""
          name="Применить"
          disabled={buttonDisabled}
          onClick={onClickConfirm}
          loading={isWaitingToResponse}
        />
      </div>
      <ErrorsList errors={errors} className="px-1" />
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
              required
              error={errors.images}
            />
            <Input
              label="Имя"
              type="text"
              value={firstName}
              onChange={(value) => {
                removeError('firstName')
                setFirstName(upperCaseFirst(value.trim()))
              }}
              required
              // labelClassName="w-40"
              error={errors.firstName}
              showErrorText
              inputClassName="capitalize"
            />
            <Input
              label="Фамилия"
              type="text"
              value={secondName}
              onChange={(value) => {
                removeError('secondName')
                setSecondName(upperCaseFirst(value.trim()))
              }}
              required
              // labelClassName="w-40"
              inputClassName="capitalize"
              error={errors.secondName}
            />
            <Input
              label="Отчество"
              type="text"
              value={thirdName}
              onChange={(value) => {
                removeError('thirdName')
                setThirdName(upperCaseFirst(value.trim()))
              }}
              // labelClassName="w-40"
              inputClassName="capitalize"
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
            {isLoggedUserDev && (
              <ChipsSelector
                label="Интересы"
                items={items}
                onChange={setInterests}
                value={interests}
              />
            )}
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
              onClick={() =>
                modalsFunc.questionnaire.constructor(null, (data) => {
                  console.log('!!!!', data)
                  modalsFunc.questionnaire.open(data, (res) =>
                    console.log('res', res)
                  )
                })
              }
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
              onChange={(value) => setSecurytyKey({ fullSecondName: value })}
              name="yes_no"
              // inLine
              required
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
              onChange={(value) => setSecurytyKey({ fullThirdName: value })}
              name="yes_no"
              // inLine
              required
            />
            <YesNoPicker
              label="Показывать дату рождения"
              // inLine
              value={security.showBirthday}
              onChange={(value) => setSecurytyKey({ showBirthday: value })}
              required
            />
            <YesNoPicker
              label="Показывать возраст"
              // inLine
              value={security.showAge}
              onChange={(value) => setSecurytyKey({ showAge: value })}
              required
            />
            <YesNoPicker
              label="Показывать контакты (телефон и пр.)"
              // inLine
              value={security.showContacts}
              onChange={(value) => setSecurytyKey({ showContacts: value })}
              required
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
    </div>
  )
}

export default QuestionnaireContent
