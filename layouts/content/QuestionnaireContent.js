import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import EventTagsChipsSelector from '@components/Chips/EventTagsChipsSelector'
import ComboBox from '@components/ComboBox'
import DatePicker from '@components/DatePicker'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImages from '@components/InputImages'
import InputWrapper from '@components/InputWrapper'
import LoadingSpinner from '@components/LoadingSpinner'
import PhoneInput from '@components/PhoneInput'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import GenderPicker from '@components/ValuePicker/GenderPicker'
import HaveKidsPicker from '@components/ValuePicker/HaveKidsPicker'
import UserRolePicker from '@components/ValuePicker/UserRolePicker'
import UserStatusPicker from '@components/ValuePicker/UserStatusPicker'
import ValuePicker from '@components/ValuePicker/ValuePicker'
import YesNoPicker from '@components/ValuePicker/YesNoPicker'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getData, putData } from '@helpers/CRUD'
import compareArrays from '@helpers/compareArrays'
import compareObjects from '@helpers/compareObjects'
import { DEFAULT_USER } from '@helpers/constants'
import upperCaseFirst from '@helpers/upperCaseFirst'
import useErrors from '@helpers/useErrors'
import useSnackbar from '@helpers/useSnackbar'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import userEditSelector from '@state/selectors/userEditSelector'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const ShowWrapper = ({ children, securytyKey, value, setSecurytyKey }) => (
  <div className="flex items-center py-3 pb-0 gap-x-1">
    {children}
    <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
      <FontAwesomeIcon
        className={cn('w-5 h-5', value ? 'text-purple-500' : 'text-disabled')}
        icon={value ? faEye : faEyeSlash}
        size="1x"
        onClick={() => setSecurytyKey({ [securytyKey]: !value })}
      />
    </div>
  </div>
)

const QuestionnaireContent = (props) => {
  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom)
  const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
  const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)
  const setUserInUsersState = useSetRecoilState(userEditSelector)

  const [
    waitActivateTelegramNotifications,
    setWaitActivateTelegramNotifications,
  ] = useState(false)

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

  var defaultSecurity = { ...loggedUser?.security }
  if (
    loggedUser?.security.showContacts === true ||
    loggedUser?.security.showContacts === false ||
    loggedUser?.security.showContacts === null
  ) {
    defaultSecurity.showPhone = !!loggedUser?.security.showContacts
    defaultSecurity.showWhatsapp = !!loggedUser?.security.showContacts
    defaultSecurity.showViber = !!loggedUser?.security.showContacts
    defaultSecurity.showTelegram = !!loggedUser?.security.showContacts
    defaultSecurity.showInstagram = !!loggedUser?.security.showContacts
    defaultSecurity.showVk = !!loggedUser?.security.showContacts
    defaultSecurity.showEmail = !!loggedUser?.security.showContacts
    delete defaultSecurity.showContacts
  }

  if (loggedUser?.security.showAge === true) {
    defaultSecurity.showBirthday = 'full'
    delete defaultSecurity.showAge
  } else if (
    loggedUser?.security.showAge === false ||
    loggedUser?.security.showAge === null
  ) {
    defaultSecurity.showBirthday = 'no'
    delete defaultSecurity.showAge
  }

  const [security, setSecurity] = useState(
    defaultSecurity ?? DEFAULT_USER.security
  )

  const [notifications, setNotifications] = useState(
    loggedUser?.notifications ?? DEFAULT_USER.notifications
  )

  const toggleNotificationsSettings = (key) =>
    setNotifications((state) => ({
      ...state,
      settings: {
        ...notifications?.settings,
        [key]: notifications?.settings ? !notifications?.settings[key] : true,
      },
    }))

  const [status, setStatus] = useState(
    loggedUser?.status ?? DEFAULT_USER.status
  )
  const [role, setRole] = useState(loggedUser?.role ?? DEFAULT_USER.role)

  const setSecurytyKey = (data) => {
    setSecurity((state) => {
      return { ...state, ...data }
    })
  }

  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)

  const { success, error } = useSnackbar()

  const isNotificationActivated =
    notifications?.telegram?.id && notifications?.telegram?.active

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
    !compareObjects(loggedUser?.notifications, notifications)

  const onClickConfirm = async () => {
    if (waitActivateTelegramNotifications) {
      addError({
        notificationTelegramUserId: 'Завершите активацию!',
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
        // images,
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
          success('Данные профиля обновлены успешно')
          setIsWaitingToResponse(false)
          // refreshPage()
        },
        () => {
          error('Ошибка обновления данных профиля')
          addError({ response: 'Ошибка обновления данных профиля' })
          setIsWaitingToResponse(false)
        },
        false,
        loggedUser._id
      )
      // setIsWaitingToResponse(false)
    }
  }

  useEffect(() => {
    if (waitActivateTelegramNotifications) {
      var interval
      const fetchUser = async () => {
        const data = await getData(
          `/api/users/${loggedUser._id}`,
          null,
          null,
          null,
          true
        )

        if (data?.notifications?.telegram?.id) {
          setLoggedUser({
            ...data,
            notifications: {
              ...data.notifications,
              telegram: { ...data.notifications.telegram, active: true },
            },
          })
          // setLoggedUser({
          //   ...data,
          //   notifications: {
          //     ...data.notifications,
          //     telegram: { ...data.notifications.telegram, active: true },
          //   },
          // })
          setNotifications((state) => ({
            ...state,
            telegram: data?.notifications?.telegram,
            active: true,
          }))
          setWaitActivateTelegramNotifications(false)
          clearInterval(interval)
        }
      }

      interval = setInterval(() => {
        fetchUser().catch(console.error)
      }, 5000)
    }
  }, [waitActivateTelegramNotifications])

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
      (!firstName || !secondName || !birthday || !gender)
      // ||
      // !images ||
      // images.length === 0
    ) {
      modalsFunc.add({
        uid: 'questionnaireNotFilled',
        title: 'Необходимо заполнить профиль',
        text: (
          <div className="leading-4">
            <span>
              {
                'Для возможности записи на мероприятия, а также покупки услуг и товаров необходимо заполнить обязательные поля профиля:'
              }
            </span>
            <ul className="ml-4 leading-5 list-disc">
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
              {/* {(!loggedUser.images || loggedUser.images.length === 0) && (
                <li className="font-bold text-red-500">
                  {'Фотографии (добавьте хотя бы одно фото)'}
                </li>
              )} */}
            </ul>
            <span>
              {
                'Пожалуйста заполните поля максимально полно и честно! Во вкладке "конфиденциальность" вы можете скрыть те данные, которые не хотели бы показывать другим.'
              }
            </span>
          </div>
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
          <div className="text-sm">
            <span>{'Примечание:'}</span>
            <div className="flex pl-4 leading-4">
              <FontAwesomeIcon
                className={cn('w-4 min-w-4 h-4 text-purple-500')}
                icon={faEye}
                size="1x"
              />
              <span className="ml-1">{'-'}</span>
              <span className="flex-1 ml-1">
                {'поле доступно для просмотра пользователям'}
              </span>
            </div>
            <div className="flex pl-4 mt-1 leading-4">
              <FontAwesomeIcon
                className={cn('w-4 min-w-4 h-4 text-disabled')}
                icon={faEyeSlash}
                size="1x"
              />
              <span className="ml-1">{'-'}</span>
              <span className="flex-1 ml-1">
                {
                  'поле скрыто от пользователей и доступно только администратору'
                }
              </span>
            </div>
          </div>
          {/* <div className="flex flex-col flex-1 max-h-full px-2 mb-2 gap-y-2"> */}
          <FormWrapper className="mt-6">
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
            {/* <ShowWrapper
              securytyKey="showBirthday"
              value={security.showBirthday}
              setSecurytyKey={setSecurytyKey}
            > */}
            <div className="mt-3 mb-2">
              <DatePicker
                label="День рождения"
                value={birthday}
                onChange={setBirthday}
                error={errors.birthday}
                showYears
                showZodiac
                required
                // noMargin
              />
            </div>
            {/* </ShowWrapper> */}

            <FormWrapper twoColumns>
              <ShowWrapper
                securytyKey="showPhone"
                value={security.showPhone}
                setSecurytyKey={setSecurytyKey}
              >
                <PhoneInput
                  required
                  label="Телефон (логин)"
                  value={phone}
                  onChange={setPhone}
                  error={errors.phone}
                  copyPasteButtons
                  disabled
                  noMargin
                />
              </ShowWrapper>
              <ShowWrapper
                securytyKey="showWhatsapp"
                value={security.showWhatsapp}
                setSecurytyKey={setSecurytyKey}
              >
                <PhoneInput
                  label="Whatsapp"
                  value={whatsapp}
                  onChange={setWhatsapp}
                  error={errors.whatsapp}
                  copyPasteButtons
                  noMargin
                />
              </ShowWrapper>
            </FormWrapper>
            <FormWrapper twoColumns>
              <ShowWrapper
                securytyKey="showViber"
                value={security.showViber}
                setSecurytyKey={setSecurytyKey}
              >
                <PhoneInput
                  label="Viber"
                  value={viber}
                  onChange={setViber}
                  error={errors.viber}
                  copyPasteButtons
                  noMargin
                />
              </ShowWrapper>
              <ShowWrapper
                securytyKey="showTelegram"
                value={security.showTelegram}
                setSecurytyKey={setSecurytyKey}
              >
                <Input
                  prefix="@"
                  label="Telegram"
                  value={telegram}
                  onChange={setTelegram}
                  copyPasteButtons
                  noMargin
                />
              </ShowWrapper>
            </FormWrapper>
            <FormWrapper twoColumns>
              <ShowWrapper
                securytyKey="showInstagram"
                value={security.showInstagram}
                setSecurytyKey={setSecurytyKey}
              >
                <Input
                  prefix="@"
                  label="Instagram"
                  value={instagram}
                  onChange={setInstagram}
                  copyPasteButtons
                  noMargin
                />
              </ShowWrapper>
              <ShowWrapper
                securytyKey="showVk"
                value={security.showVk}
                setSecurytyKey={setSecurytyKey}
              >
                <Input
                  prefix="@"
                  label="Vk"
                  value={vk}
                  onChange={setVk}
                  copyPasteButtons
                  noMargin
                />
              </ShowWrapper>
            </FormWrapper>
            <ShowWrapper
              securytyKey="showEmail"
              value={security.showEmail}
              setSecurytyKey={setSecurytyKey}
            >
              <Input
                label="Email"
                value={email}
                onChange={setEmail}
                error={errors.email}
                copyPasteButtons
                noMargin
              />
            </ShowWrapper>
            <HaveKidsPicker haveKids={haveKids} onChange={setHaveKids} />
          </FormWrapper>
          {/* {isLoggedUserDev && (
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
          )} */}
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
              // name="yes_no"
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
              // name="yes_no"
              // inLine
              required
            />
            {/* <YesNoPicker
              label="Показывать дату рождения"
              // inLine
              value={security.showBirthday}
              onChange={(value) => setSecurytyKey({ showBirthday: value })}
              required
            /> */}
            <ValuePicker
              value={security.showBirthday}
              valuesArray={[
                {
                  value: 'full',
                  name: 'Показывать (в том числе возраст)',
                  color: 'green-400',
                },
                {
                  value: 'noYear',
                  name: 'Только день и месяц (скрыть возраст)',
                  color: 'blue-400',
                },
                {
                  value: 'no',
                  name: 'Не показывать',
                  color: 'red-400',
                },
              ]}
              label="Показывать дату рождения"
              onChange={(value) => setSecurytyKey({ showBirthday: value })}
              // name="yes_no"
              // inLine
              required
            />
            {/* <YesNoPicker
              label="Показывать возраст"
              // inLine
              value={security.showAge}
              onChange={(value) => setSecurytyKey({ showAge: value })}
              required
            /> */}
            {/* <YesNoPicker
              label="Показывать контакты (телефон и пр.)"
              // inLine
              value={security.showContacts}
              onChange={(value) => setSecurytyKey({ showContacts: value })}
              required
            /> */}
          </FormWrapper>
          {/* </FormWrapper> */}
        </TabPanel>
        {isLoggedUserAdmin && (
          <TabPanel tabName="Статус и права" className="">
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
        {(isLoggedUserMember || isLoggedUserModer) && (
          <TabPanel tabName="Оповещения" className="flex-1">
            <div className="flex flex-wrap items-center gap-x-2">
              <YesNoPicker
                label="Оповещения в Telegram"
                // inLine
                value={notifications?.telegram?.active ?? false}
                onChange={() => {
                  // removeError('notificationTelegramUserName')
                  if (notifications?.telegram?.active) {
                    modalsFunc.notifications.telegram.deactivate(() => {
                      setNotifications((state) => ({
                        ...state,
                        telegram: {
                          active: false,
                          userName: undefined,
                          id: undefined,
                        },
                      }))
                    })
                  } else {
                    setNotifications((state) => ({
                      ...state,
                      telegram: {
                        ...notifications?.telegram,
                        active: true,
                      },
                    }))
                    modalsFunc.notifications.telegram.activate(
                      () => setWaitActivateTelegramNotifications(true),
                      () =>
                        setNotifications((state) => ({
                          ...state,
                          telegram: {
                            active: false,
                            userName: undefined,
                            id: undefined,
                          },
                        }))
                    )
                  }
                }}
                readOnly={waitActivateTelegramNotifications}
              />
              {waitActivateTelegramNotifications && (
                <div className="flex items-center mt-3 gap-x-3">
                  <span className="text-orange-400">ОЖИДАЕМ АКТИВАЦИЮ</span>
                  <LoadingSpinner size="xs" />
                  <Button
                    name="Отмена"
                    onClick={async () => {
                      setWaitActivateTelegramNotifications(false)
                      setNotifications((state) => ({
                        ...state,
                        telegram: {
                          active: false,
                          userName: undefined,
                          id: undefined,
                        },
                      }))
                      await putData(
                        `/api/users/${loggedUser._id}`,
                        {
                          notifications: {
                            ...loggedUser.notifications,
                            telegram: { active: false },
                          },
                        },
                        null,
                        null,
                        false,
                        loggedUser._id
                      )
                    }}
                    thin
                  />
                </div>
              )}
            </div>

            {isNotificationActivated && (
              <>
                {isLoggedUserModer && (
                  <InputWrapper label="Ежедневные уведомления" className="">
                    <div className="w-full">
                      <ComboBox
                        label="Время уведомлений"
                        items={[
                          '00:00',
                          '00:30',
                          '01:00',
                          '01:30',
                          '02:00',
                          '02:30',
                          '03:00',
                          '03:30',
                          '04:00',
                          '04:30',
                          '05:00',
                          '05:30',
                          '06:00',
                          '06:30',
                          '07:00',
                          '07:30',
                          '08:00',
                          '08:30',
                          '09:00',
                          '09:30',
                          '10:00',
                          '10:30',
                          '11:00',
                          '11:30',
                          '12:00',
                          '12:30',
                          '13:00',
                          '13:30',
                          '14:00',
                          '14:30',
                          '15:00',
                          '15:30',
                          '16:00',
                          '16:30',
                          '17:00',
                          '17:30',
                          '18:00',
                          '18:30',
                          '19:00',
                          '19:30',
                          '20:00',
                          '20:30',
                          '21:00',
                          '21:30',
                          '22:00',
                          '22:30',
                          '23:00',
                          '23:30',
                        ].map((time) => ({ value: time, name: time }))}
                        value={notifications.settings?.time}
                        onChange={(time) =>
                          setNotifications((state) => ({
                            ...state,
                            settings: {
                              ...notifications?.settings,
                              time,
                            },
                          }))
                        }
                        className="w-40 mt-2"
                        required={notifications.settings?.birthdays}
                        noMargin
                        placeholder="Не выбрано"
                      />

                      {isLoggedUserModer && (
                        <CheckBox
                          checked={notifications.settings?.birthdays}
                          onClick={() =>
                            toggleNotificationsSettings('birthdays')
                          }
                          label="Напоминания о днях рождениях пользователей (админ)"
                        />
                      )}
                    </div>
                  </InputWrapper>
                )}
                <InputWrapper label="Уведомления по событиям" className="">
                  <div className="w-full">
                    {isLoggedUserModer && (
                      <CheckBox
                        checked={notifications.settings?.newUserRegistred}
                        onClick={() => {
                          toggleNotificationsSettings('newUserRegistred')
                        }}
                        label="Регистрации нового пользователя (админ)"
                      />
                    )}
                    {isLoggedUserModer && (
                      <CheckBox
                        checked={notifications.settings?.eventRegistration}
                        onClick={() =>
                          toggleNotificationsSettings('eventRegistration')
                        }
                        label="Запись/отписка пользователей на мероприитиях (админ)"
                      />
                    )}
                    <CheckBox
                      checked={notifications.settings?.newEventsByTags}
                      onClick={() =>
                        toggleNotificationsSettings('newEventsByTags')
                      }
                      label="Новые мероприятия (по тэгам мероприятий)"
                    />
                    {notifications.settings?.newEventsByTags && (
                      <EventTagsChipsSelector
                        placeholder="Мне интересно всё!"
                        label="Тэги мероприятий которые мне интересны"
                        onChange={(value) =>
                          setNotifications((state) => ({
                            ...state,
                            settings: {
                              ...notifications?.settings,
                              eventsTags: value,
                            },
                          }))
                        }
                        tags={notifications.settings?.eventsTags}
                      />
                    )}
                    {isLoggedUserDev && (
                      <CheckBox
                        checked={notifications.settings?.eventUserMoves}
                        onClick={() =>
                          toggleNotificationsSettings('eventUserMoves')
                        }
                        label="Перемещение моей записи на мероприятие из резерва в основной состав и наоборот"
                      />
                    )}
                    {isLoggedUserDev && (
                      <CheckBox
                        checked={notifications.settings?.eventCancel}
                        onClick={() =>
                          toggleNotificationsSettings('eventCancel')
                        }
                        label="Отмена мероприятия на которое я записан"
                      />
                    )}
                  </div>
                </InputWrapper>
              </>
            )}
          </TabPanel>
        )}
      </TabContext>
    </div>
  )
}

export default QuestionnaireContent
