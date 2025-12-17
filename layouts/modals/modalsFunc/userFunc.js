import CardButtons from '@components/CardButtons'
import RelationshipSelector from '@components/ComboBox/RelationshipSelector'
import DatePicker from '@components/DatePicker'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImages from '@components/InputImages'
import PhoneInput from '@components/PhoneInput'
import { SelectUser } from '@components/SelectItem'
import GenderPicker from '@components/ValuePicker/GenderPicker'
import HaveKidsPicker from '@components/ValuePicker/HaveKidsPicker'
import UserRolePicker from '@components/ValuePicker/UserRolePicker'
import UserStatusPicker from '@components/ValuePicker/UserStatusPicker'
import compareArrays from '@helpers/compareArrays'
import { DEFAULT_USER } from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import userSelector from '@state/selectors/userSelector'
import { useEffect, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import CopyPasteButtons from '@components/CopyPasteButtons'
import isLoggedUserPresidentSelector from '@state/selectors/isLoggedUserPresidentSelector'

const userFunc = (userId, clone = false) => {
  const UserModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const [loggedUserActive, setLoggedUserActive] =
      useAtom(loggedUserActiveAtom)

    const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
    const isLoggedUserPresident = useAtomValue(isLoggedUserPresidentSelector)
    const isLoggedUserDev = loggedUserActiveRole?.dev
    const canSetRole = loggedUserActiveRole?.users?.setRole
    const canSetStatus = loggedUserActiveRole?.users?.setStatus
    const canEditReferrer = ['admin', 'moder', 'dev'].includes(
      loggedUserActive?.role
    )

    const user = useAtomValue(userSelector(userId))
    const setUser = useAtomValue(itemsFuncAtom).user.set
    const users = useAtomValue(usersAtomAsync)

    const [firstName, setFirstName] = useState(
      user?.firstName ?? DEFAULT_USER.firstName
    )
    const [secondName, setSecondName] = useState(
      user?.secondName ?? DEFAULT_USER.secondName
    )
    const [thirdName, setThirdName] = useState(
      user?.thirdName ?? DEFAULT_USER.thirdName
    )
    const [password, setPassword] = useState(
      user?.password ?? DEFAULT_USER.password
    )
    // const [about, setAbout] = useState(user?.about ?? DEFAULT_USER.about)
    // const [interests, setInterests] = useState(user?.interests ?? DEFAULT_USER.interests)
    // const [profession, setProfession] = useState(user?.profession ?? DEFAULT_USER.profession)
    // const [orientation, setOrientation] = useState(user?.orientation ?? DEFAULT_USER.orientation)
    const [gender, setGender] = useState(user?.gender ?? DEFAULT_USER.gender)
    const [relationship, setRelationship] = useState(
      user?.relationship ?? DEFAULT_USER.relationship
    )
    const [personalStatus, setPersonalStatus] = useState(
      user?.personalStatus ?? DEFAULT_USER.personalStatus
    )

    const [email, setEmail] = useState(user?.email ?? DEFAULT_USER.email)
    const [phone, setPhone] = useState(user?.phone ?? DEFAULT_USER.phone)
    const [whatsapp, setWhatsapp] = useState(
      user?.whatsapp ?? DEFAULT_USER.whatsapp
    )
    const [viber, setViber] = useState(user?.viber ?? DEFAULT_USER.viber)
    const [telegram, setTelegram] = useState(
      user?.telegram ?? DEFAULT_USER.telegram
    )
    const [instagram, setInstagram] = useState(
      user?.instagram ?? DEFAULT_USER.instagram
    )
    const [vk, setVk] = useState(user?.vk ?? DEFAULT_USER.vk)
    const [images, setImages] = useState(user?.images ?? DEFAULT_USER.images)
    const [birthday, setBirthday] = useState(
      user?.birthday ?? DEFAULT_USER.birthday
    )
    const [status, setStatus] = useState(user?.status ?? DEFAULT_USER.status)
    const [role, setRole] = useState(user?.role ?? DEFAULT_USER.role)
    const [referrerId, setReferrerId] = useState(user?.referrerId ?? null)

    const [haveKids, setHaveKids] = useState(
      user?.haveKids ?? DEFAULT_USER.haveKids
    )

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {
      // Если создаем нового пользователя в ручную, то сначала проверим - нет ли уже такого номера телефона в системе
      if (!userId && phone) {
        const existedUser = users.find((user) => user.phone === phone)
        if (existedUser) {
          addError({
            phone: 'Пользователь с таким номером телефона уже существует',
          })
          return
        }
      }
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
          relationship,
        })
      ) {
        closeModal()
        const result = await setUser(
          {
            _id: user?._id,
            firstName,
            secondName,
            thirdName,
            // about,
            // interests,
            // profession,
            // orientation,
            password: userId ? undefined : password,
            gender,
            relationship,
            personalStatus,
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
            role,
            haveKids,
            referrerId,
          },
          clone
        )

        if (user?._id && loggedUserActive?._id === result?._id) {
          setLoggedUserActive(result)
        }
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
      const isFormChanged =
        (user?.firstName ?? DEFAULT_USER.firstName) !== firstName ||
        (user?.secondName ?? DEFAULT_USER.secondName) !== secondName ||
        (user?.thirdName ?? DEFAULT_USER.thirdName) !== thirdName ||
        (!userId && user?.password !== password) ||
        // user?.about !== about ||
        // user?.interests !== interests ||
        // user?.profession !== profession ||
        // user?.orientation !== orientation ||
        (user?.gender ?? DEFAULT_USER.gender) !== gender ||
        (user?.relationship ?? DEFAULT_USER.relationship) !== relationship ||
        (user?.personalStatus ?? DEFAULT_USER.personalStatus) !==
          personalStatus ||
        (user?.email ?? DEFAULT_USER.email) !== email ||
        (user?.phone ?? DEFAULT_USER.phone) !== phone ||
        (user?.whatsapp ?? DEFAULT_USER.whatsapp) !== whatsapp ||
        (user?.viber ?? DEFAULT_USER.viber) !== viber ||
        (user?.telegram ?? DEFAULT_USER.telegram) !== telegram ||
        (user?.instagram ?? DEFAULT_USER.instagram) !== instagram ||
        (user?.vk ?? DEFAULT_USER.vk) !== vk ||
        !compareArrays(user?.images ?? DEFAULT_USER.images, images) ||
        (user?.birthday ?? DEFAULT_USER.birthday) !== birthday ||
        (user?.haveKids ?? DEFAULT_USER.haveKids) !== haveKids ||
        (user?.status ?? DEFAULT_USER.status) !== status ||
        (user?.role ?? DEFAULT_USER.role) !== role ||
        (user?.referrerId ?? null) !== referrerId

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [
      firstName,
      secondName,
      thirdName,
      password,
      // about,
      // interests,
      // profession,
      // orientation,
      gender,
      relationship,
      personalStatus,
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
      role,
      haveKids,
      referrerId,
    ])

    useEffect(() => {
      if (setTopLeftComponent)
        setTopLeftComponent(() => (
          <CardButtons
            item={user}
            typeOfItem="user"
            forForm
            noEditButton
            onDelete={closeModal}
          />
        ))
    }, [setTopLeftComponent])

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
          required
          autoComplete="on"
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
          required
          autoComplete="on"
        />
        <Input
          label="Отчество"
          type="text"
          value={thirdName}
          onChange={(value) => {
            removeError('thirdName')
            setThirdName(value)
          }}
          error={errors.thirdName}
          autoComplete="on"
        />
        {!userId && (
          <Input
            label="Пароль"
            type="password"
            value={password}
            onChange={(value) => {
              removeError('password')
              setPassword(value)
            }}
            error={errors.password}
            // autoComplete="on"
            autoComplete="on"
          />
        )}
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
        <Input
          label="Статус (будет виден всем на карточке)"
          type="text"
          value={personalStatus}
          onChange={setPersonalStatus}
        />
        <FormWrapper twoColumns>
          <div className="flex items-center gap-x-1">
            <PhoneInput
              required
              label="Телефон"
              value={phone}
              onChange={setPhone}
              error={errors.phone}
            />
            <CopyPasteButtons
              onPaste={setPhone}
              copyText={phone ? `+${phone}` : undefined}
              pastePhone
            />
          </div>
          <div className="flex items-center gap-x-1">
            <PhoneInput
              label="Whatsapp"
              value={whatsapp}
              onChange={setWhatsapp}
              error={errors.whatsapp}
            />
            <CopyPasteButtons
              onPaste={setWhatsapp}
              copyText={whatsapp ? `+${whatsapp}` : undefined}
              pastePhone
            />
          </div>
        </FormWrapper>
        <FormWrapper twoColumns>
          <div className="flex items-center gap-x-1">
            <PhoneInput
              label="Viber"
              value={viber}
              onChange={setViber}
              error={errors.viber}
            />
            <CopyPasteButtons
              onPaste={setViber}
              copyText={viber ? `+${viber}` : undefined}
              pastePhone
            />
          </div>
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
        <Input
          label="Email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
        {/* <CheckBox
          checked={haveKids}
          labelPos="left"
          onClick={() => setHaveKids((checked) => !checked)}
          label="Есть дети"
        /> */}
        <HaveKidsPicker haveKids={haveKids} onChange={setHaveKids} />
        {canSetStatus && (
          <UserStatusPicker
            required
            status={status}
            onChange={setStatus}
            error={errors.status}
          />
        )}
        {canSetRole && (
          <UserRolePicker
            required
            roleId={role}
            onChange={setRole}
            error={errors.role}
            noPresident={!isLoggedUserPresident}
            noDev={!isLoggedUserDev}
          />
        )}
        {canEditReferrer && (
          <SelectUser
            label="Реферер"
            selectedId={referrerId}
            onChange={setReferrerId}
            exceptedIds={user?._id ? [user._id] : []}
            clearButton
            modalTitle="Выбор реферера"
          />
        )}
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
