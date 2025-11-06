'use client'

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
import { faAsterisk } from '@fortawesome/free-solid-svg-icons/faAsterisk'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { putData } from '@helpers/CRUD'
import compareArrays from '@helpers/compareArrays'
import compareObjects from '@helpers/compareObjects'
import { DEFAULT_USER } from '@helpers/constants'
import upperCaseFirst from '@helpers/upperCaseFirst'
import useErrors from '@helpers/useErrors'
import useSnackbar from '@helpers/useSnackbar'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import userEditSelector from '@state/selectors/userEditSelector'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import locationAtom from '@state/atoms/locationAtom'
import isLoggedUserPresidentSelector from '@state/selectors/isLoggedUserPresidentSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import useRouter from '@utils/useRouter'

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
  const router = useRouter()
  const location = useAtomValue(locationAtom)
  const [loggedUserActive, setLoggedUserActive] = useAtom(loggedUserActiveAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const isLoggedUserPresident = useAtomValue(isLoggedUserPresidentSelector)
  const setLoggedUserActiveRoleName = useSetAtom(loggedUserActiveRoleNameAtom)
  const isLoggedUserDev = useAtomValue(isLoggedUserDevSelector)

  const { towns } = useAtomValue(locationPropsSelector)

  const setSelfStatus = loggedUserActiveRole?.setSelfStatus
  const setSelfRole = loggedUserActiveRole?.setSelfRole

  const [isImageLoading, setIsImageLoading] = useState(false)

  const setUserInUsersState = useSetAtom(userEditSelector)

  const [firstName, setFirstName] = useState(
    loggedUserActive?.firstName ?? DEFAULT_USER.firstName
  )
  const [secondName, setSecondName] = useState(
    loggedUserActive?.secondName ?? DEFAULT_USER.secondName
  )
  const [thirdName, setThirdName] = useState(
    loggedUserActive?.thirdName ?? DEFAULT_USER.thirdName
  )
  // const [about, setAbout] = useState(user?.about ?? '')
  // const [interests, setInterests] = useState(user?.interests ?? '')
  // const [profession, setProfession] = useState(user?.profession ?? '')
  // const [orientation, setOrientation] = useState(user?.orientation ?? DEFAULT_USER.orientation)
  const [gender, setGender] = useState(
    loggedUserActive?.gender ?? DEFAULT_USER.gender
  )
  const [relationship, setRelationship] = useState(
    loggedUserActive?.relationship ?? DEFAULT_USER.relationship
  )
  const [town, setTown] = useState(loggedUserActive?.town ?? DEFAULT_USER.town)
  // const [personalStatus, setPersonalStatus] = useState(
  //   loggedUserActive?.personalStatus ?? DEFAULT_USER.personalStatus
  // )

  const [email, setEmail] = useState(
    loggedUserActive?.email ?? DEFAULT_USER.email
  )
  const [phone, setPhone] = useState(
    loggedUserActive?.phone ?? DEFAULT_USER.phone
  )
  const [whatsapp, setWhatsapp] = useState(
    loggedUserActive?.whatsapp ?? DEFAULT_USER.whatsapp
  )
  const [viber, setViber] = useState(
    loggedUserActive?.viber ?? DEFAULT_USER.viber
  )
  const [telegram, setTelegram] = useState(
    loggedUserActive?.telegram ?? DEFAULT_USER.telegram
  )
  const [instagram, setInstagram] = useState(
    loggedUserActive?.instagram ?? DEFAULT_USER.instagram
  )
  const [vk, setVk] = useState(loggedUserActive?.vk ?? DEFAULT_USER.vk)
  const [images, setImages] = useState(
    loggedUserActive?.images ?? DEFAULT_USER.images
  )
  const [birthday, setBirthday] = useState(
    loggedUserActive?.birthday ?? DEFAULT_USER.birthday
  )

  const [haveKids, setHaveKids] = useState(
    loggedUserActive?.haveKids ?? DEFAULT_USER.haveKids
  )

  var defaultSecurity = { ...loggedUserActive?.security }
  // if (
  //   loggedUserActive?.security?.showContacts === true ||
  //   loggedUserActive?.security?.showContacts === false ||
  //   loggedUserActive?.security?.showContacts === null
  // ) {
  //   defaultSecurity.showPhone = !!loggedUserActive?.security.showContacts
  //   defaultSecurity.showWhatsapp = !!loggedUserActive?.security.showContacts
  //   defaultSecurity.showViber = !!loggedUserActive?.security.showContacts
  //   defaultSecurity.showTelegram = !!loggedUserActive?.security.showContacts
  //   defaultSecurity.showInstagram = !!loggedUserActive?.security.showContacts
  //   defaultSecurity.showVk = !!loggedUserActive?.security.showContacts
  //   defaultSecurity.showEmail = !!loggedUserActive?.security.showContacts
  //   delete defaultSecurity.showContacts
  // }

  if (loggedUserActive?.security?.showAge === true) {
    defaultSecurity.showBirthday = 'full'
    delete defaultSecurity.showAge
  } else if (
    loggedUserActive?.security?.showAge === false ||
    loggedUserActive?.security?.showAge === null
  ) {
    defaultSecurity.showBirthday = 'no'
    delete defaultSecurity.showAge
  }

  const [security, setSecurity] = useState(
    defaultSecurity ?? DEFAULT_USER.security
  )

  const [status, setStatus] = useState(
    loggedUserActive?.status ?? DEFAULT_USER.status
  )
  const [role, setRole] = useState(loggedUserActive?.role ?? DEFAULT_USER.role)

  const setSecurytyKey = (data) => {
    setSecurity((state) => {
      return { ...state, ...data }
    })
  }

  const modalsFunc = useAtomValue(modalsFuncAtom)

  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)

  const { success, error } = useSnackbar()

  const formChanged =
    loggedUserActive?.firstName !== firstName ||
    loggedUserActive?.secondName !== secondName ||
    loggedUserActive?.thirdName !== thirdName ||
    // user?.about !== about ||
    // user?.interests !== interests ||
    // user?.profession !== profession ||
    // user?.orientation !== orientation ||
    loggedUserActive?.gender !== gender ||
    loggedUserActive?.relationship !== relationship ||
    loggedUserActive?.town !== town ||
    // loggedUserActive?.personalStatus !== personalStatus ||
    loggedUserActive?.email !== email ||
    loggedUserActive?.phone !== phone ||
    loggedUserActive?.whatsapp !== whatsapp ||
    loggedUserActive?.viber !== viber ||
    loggedUserActive?.telegram !== telegram ||
    loggedUserActive?.instagram !== instagram ||
    loggedUserActive?.vk !== vk ||
    !compareArrays(loggedUserActive?.images, images) ||
    loggedUserActive?.birthday !== birthday ||
    loggedUserActive?.haveKids !== haveKids ||
    !compareObjects(loggedUserActive?.security, security) ||
    loggedUserActive?.status !== status ||
    loggedUserActive?.role !== role
  // ||
  // !compareObjects(loggedUserActive?.notifications, notifications)

  const onClickConfirm = async () => {
    if (
      !checkErrors({
        firstName: firstName.trim(),
        secondName: secondName.trim(),
        thirdName: thirdName.trim(),
        gender,
        phone,
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
        `/api/${location}/users/${loggedUserActive._id}`,
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
          status,
          role,
        },
        (data) => {
          setLoggedUserActive(data)
          setUserInUsersState(data)
          if (data.role !== 'dev') setLoggedUserActiveRoleName(data.role)
          success('Данные профиля обновлены успешно')
          router.push(`/${location}/cabinet/eventsUpcoming`)
          setIsWaitingToResponse(false)
        },
        () => {
          error('Ошибка обновления данных профиля')
          addError({ response: 'Ошибка обновления данных профиля' })
          setIsWaitingToResponse(false)
        },
        false,
        loggedUserActive._id
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
              {!loggedUserActive.firstName && (
                <li className="font-bold text-red-500">Имя</li>
              )}
              {!loggedUserActive.secondName && (
                <li className="font-bold text-red-500">Фамилия</li>
              )}
              {!loggedUserActive.birthday && (
                <li className="font-bold text-red-500">Дата рождения</li>
              )}
              {!loggedUserActive.gender && (
                <li className="font-bold text-red-500">Пол</li>
              )}
              {!loggedUserActive.relationship && (
                <li className="font-bold text-red-500">Статус отношений</li>
              )}
              {!loggedUserActive.phone && (
                <li className="font-bold text-red-500">Телефон</li>
              )}
              {/* {(!loggedUserActive.images || loggedUserActive.images.length === 0) && (
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

  const buttonDisabled =
    !formChanged || loggedUserActive.status === 'ban' || isImageLoading

  return (
    <div className="flex flex-col flex-1 h-full max-w-full max-h-full min-h-full">
      <div className="flex items-center w-full p-1 gap-x-1">
        <div className="flex flex-row-reverse flex-1">
          {!buttonDisabled ? (
            <span className="leading-4 text-right tablet:text-lg">
              Чтобы изменения вступили в силу нажмите:
            </span>
          ) : isImageLoading ? (
            <span className="leading-4 text-right text-gray-500 tablet:text-lg">
              Идет загрузка фотографии...
            </span>
          ) : null}
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
            onLoading={() => setIsImageLoading(true)}
            onLoaded={() => setIsImageLoading(false)}
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
            Обратите внимание, что некоторые поля ниже требуют выбрать один из
            вариантов, для этого нужно нажать на кнопку с вариантом
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
                label="Телефон"
                value={phone}
                onChange={setPhone}
                error={errors.phone}
                copyPasteButtons
                disabled={
                  !loggedUserActive?.registrationType ||
                  loggedUserActive?.registrationType === 'phone'
                }
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
            noPresident={!isLoggedUserPresident}
            noDev={!isLoggedUserDev}
          />
        )}
      </div>
    </div>
  )
}

export default QuestionnaireContent
