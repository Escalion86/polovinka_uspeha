import Button from '@components/Button'
import RelationshipSelector from '@components/ComboBox/RelationshipSelector'
import DatePicker from '@components/DatePicker'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImages from '@components/InputImages'
import Note from '@components/Note'
import PhoneInput from '@components/PhoneInput'
import GenderPicker from '@components/ValuePicker/GenderPicker'
import HaveKidsPicker from '@components/ValuePicker/HaveKidsPicker'
import UserRolePicker from '@components/ValuePicker/UserRolePicker'
import UserStatusPicker from '@components/ValuePicker/UserStatusPicker'
import ValuePicker from '@components/ValuePicker/ValuePicker'
import {
  faAsterisk,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { putData } from '@helpers/CRUD'
import compareArrays from '@helpers/compareArrays'
import compareObjects from '@helpers/compareObjects'
import { DEFAULT_USER } from '@helpers/constants'
import upperCaseFirst from '@helpers/upperCaseFirst'
import useErrors from '@helpers/useErrors'
import useSnackbar from '@helpers/useSnackbar'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
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
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const setLoggedUserActiveRoleName = useSetRecoilState(
    loggedUserActiveRoleNameAtom
  )

  const { towns } = useRecoilValue(locationPropsSelector)

  const setSelfStatus = loggedUserActiveRole?.setSelfStatus
  const setSelfRole = loggedUserActiveRole?.setSelfRole
  const isLoggedUserDev = loggedUserActiveRole?.dev

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
  const [relationship, setRelationship] = useState(
    loggedUser?.relationship ?? DEFAULT_USER.relationship
  )
  const [town, setTown] = useState(loggedUser?.town ?? DEFAULT_USER.town)
  // const [personalStatus, setPersonalStatus] = useState(
  //   loggedUser?.personalStatus ?? DEFAULT_USER.personalStatus
  // )

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
    loggedUser?.security?.showContacts === true ||
    loggedUser?.security?.showContacts === false ||
    loggedUser?.security?.showContacts === null
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

  if (loggedUser?.security?.showAge === true) {
    defaultSecurity.showBirthday = 'full'
    delete defaultSecurity.showAge
  } else if (
    loggedUser?.security?.showAge === false ||
    loggedUser?.security?.showAge === null
  ) {
    defaultSecurity.showBirthday = 'no'
    delete defaultSecurity.showAge
  }

  const [security, setSecurity] = useState(
    defaultSecurity ?? DEFAULT_USER.security
  )

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

  const formChanged =
    loggedUser?.firstName !== firstName ||
    loggedUser?.secondName !== secondName ||
    loggedUser?.thirdName !== thirdName ||
    // user?.about !== about ||
    // user?.interests !== interests ||
    // user?.profession !== profession ||
    // user?.orientation !== orientation ||
    loggedUser?.gender !== gender ||
    loggedUser?.relationship !== relationship ||
    loggedUser?.town !== town ||
    // loggedUser?.personalStatus !== personalStatus ||
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
    loggedUser?.role !== role
  // ||
  // !compareObjects(loggedUser?.notifications, notifications)

  const onClickConfirm = async () => {
    if (
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
        relationship,
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
          relationship,
          town,
          // personalStatus,
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
        },
        (data) => {
          setLoggedUser(data)
          setUserInUsersState(data)
          if (data.role !== 'dev') setLoggedUserActiveRoleName(data.role)
          success('Данные профиля обновлены успешно')
          setIsWaitingToResponse(false)
        },
        () => {
          error('Ошибка обновления данных профиля')
          addError({ response: 'Ошибка обновления данных профиля' })
          setIsWaitingToResponse(false)
        },
        false,
        loggedUser._id
      )
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
              {!loggedUser.relationship && (
                <li className="font-bold text-red-500">Статус отношений</li>
              )}
              {/* {(!loggedUser.images || loggedUser.images.length === 0) && (
                <li className="font-bold text-red-500">
                  {'Фотографии (добавьте хотя бы одно фото)'}
                </li>
              )} */}
            </ul>
            <span>
              {
                'Пожалуйста заполните поля максимально полно и честно! Если есть данные которые вы не хотите чтобы видели другие пользователи, то вы можете внести соответствующие настройки в анкете'
              }
            </span>
          </div>
        ),
        // onConfirm: () => {},
        closeButtonName: 'Хорошо, я заполню все честно!',
        crossShow: false,
        // onDecline: false,
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
      <div className="px-2 pb-2 overflow-y-auto">
        <FormWrapper>
          <Note>
            <span>Поля отмеченные знаком</span>
            <FontAwesomeIcon
              className="text-danger w-2.5 h-2.5 inline-block mx-1 mb-1"
              icon={faAsterisk}
              size="1x"
            />
            <span>обязательны для заполнения</span>
          </Note>
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
          <Note>
            <span>
              Обратите внимание, что некоторые поля ниже требуют выбрать один из
              вариантов, для этого нужно нажать на кнопку с вариантом
            </span>
          </Note>
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
            label="Показывать фамилию пользователям"
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
            label="Показывать отчество пользователям"
            onChange={(value) => setSecurytyKey({ fullThirdName: value })}
            // name="yes_no"
            // inLine
            required
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
            label="Показывать дату рождения пользователям"
            onChange={(value) => setSecurytyKey({ showBirthday: value })}
            // name="yes_no"
            // inLine
            required
          />
          <Input
            label="Город/Село проживания"
            type="text"
            value={town}
            onChange={(value) => {
              setTown(value)
            }}
            dataList={
              towns
                ? {
                    name: 'town',
                    list: towns,
                  }
                : undefined
            }
          />
          <RelationshipSelector
            value={relationship}
            onChange={(value) => {
              removeError('relationship')
              setRelationship(value)
            }}
            // placeholder={placeholder}
            // activePlaceholder={activePlaceholder}
            // smallMargin
            className="w-80"
            required
            error={errors.relationship}
            // fullWidth={fullWidth}
          />
          {/* <Input
            label="Статус (будет виден всем на вашей карточке)"
            type="text"
            value={personalStatus}
            onChange={setPersonalStatus}
          /> */}
          <Note>
            <span>
              Поля ниже можно скрыть от посторонних глаз, для этого при клике на
              иконку глаза можно показать/скрыть соответствующее поле
            </span>
            <div className="flex pt-1 pl-4">
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
            <div className="flex pl-4 mt-1">
              <FontAwesomeIcon
                className={cn('w-4 min-w-4 h-4 text-disabled')}
                icon={faEyeSlash}
                size="1x"
              />
              <span className="ml-1">{'-'}</span>
              <span className="flex-1 ml-1">
                {'поле скрыто от пользователей'}
              </span>
            </div>
          </Note>
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
        {setSelfStatus && (
          <UserStatusPicker
            required
            status={status}
            onChange={setStatus}
            error={errors.status}
          />
        )}
        {setSelfRole && (
          <UserRolePicker
            required
            roleId={role}
            onChange={setRole}
            error={errors.role}
            noDev={!isLoggedUserDev}
          />
        )}
      </div>
    </div>
  )
}

export default QuestionnaireContent
