import Button from '@components/Button'
import Divider from '@components/Divider'
// import IconButtonMenu from '@components/ButtonMenu'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
// import PhoneInput from '@components/PhoneInput'
// import {
//   faTelegram,
//   faTelegramPlane,
//   faWhatsapp,
// } from '@fortawesome/free-brands-svg-icons'
import {
  // faArrowDown,
  // faArrowUp,
  // faMinus,
  // faPaperPlane,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { postData } from '@helpers/CRUD'
// import arrayMove from '@helpers/arrayMove'
import compareObjects from '@helpers/compareObjects'
// import useErrors from '@helpers/useErrors'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
// import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { v4 as uuid } from 'uuid'
// import cn from 'classnames'
// import TelegramIcon from 'svg/TelegramIcon'
import rolesSettingsAtom from '@state/atoms/rolesSettingsAtom'
import ComboBox from '@components/ComboBox'
import { DEFAULT_ROLE } from '@helpers/constants'
import CheckBox from '@components/CheckBox'

const RoleSettings = ({ role, saveRole }) => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const [message, setMessage] = useState('')

  const [name, setName] = useState(role?.name ?? '')
  const [seeFullUsersNames, setSeeFullUsersNames] = useState(
    role?.seeFullUsersNames
  )
  const [seeAllContactsOfUsers, setSeeAllContactsOfUsers] = useState(
    role?.seeAllContactsOfUsers
  )
  const [seeBirthdayOfUsers, setSeeBirthdayOfUsers] = useState(
    role?.seeBirthdayOfUsers
  )
  const [eventUsersCounterAndAgeFull, setEventUsersCounterAndAgeFull] =
    useState(role?.eventUsersCounterAndAgeFull)
  const [eventStatusFilterFull, setEventStatusFilterFull] = useState(
    role?.eventStatusFilterFull
  )
  const [
    seeUserSumOfPaymentsWithoutEvent,
    setSeeUserSumOfPaymentsWithoutEvent,
  ] = useState(role?.seeUserSumOfPaymentsWithoutEvent)

  const [notifications, setNotifications] = useState(role?.notifications)
  const [events, setEvents] = useState(role?.notifeventsications)
  const [eventsUsers, setEventsUsers] = useState(role?.eventsUsers)
  const [users, setUsers] = useState(role?.users)
  const [directions, setDirections] = useState(role?.directions)
  const [services, setServices] = useState(role?.services)
  const [servicesUsers, setServicesUsers] = useState(role?.servicesUsers)
  const [productsUsers, setProductsUsers] = useState(role?.productsUsers)
  const [additionalBlocks, setAdditionalBlocks] = useState(
    role?.additionalBlocks
  )
  const [editSiteSettings, setEditSiteSettings] = useState(
    role?.editSiteSettings
  )
  const [setSelfStatus, setSetSelfStatus] = useState(role?.setSelfStatus)
  const [setSelfRole, setSetSelfRole] = useState(role?.setSelfRole)
  const [fabInCabinet, setFabInCabinet] = useState(role?.fabInCabinet)

  const formChanged = !compareObjects(
    role?.seeFullUsersNames,
    seeFullUsersNames
  )

  const onClickConfirm = async () => {
    saveRole({
      name,
      seeFullUsersNames,
      seeAllContactsOfUsers,
      notifications,
      seeBirthdayOfUsers,
      eventUsersCounterAndAgeFull,
      eventStatusFilterFull,
      seeUserSumOfPaymentsWithoutEvent,
      events,
      eventsUsers,
      users,
      directions,
      services,
      servicesUsers,
      productsUsers,
      additionalBlocks,
      editSiteSettings,
      setSelfStatus,
      setSelfRole,
      fabInCabinet,
    })
    // await postData(
    //   `/api/roles`,
    //   {
    //     name,
    //     seeFullUsersNames,
    //     seeAllContactsOfUsers,
    //     notifications,
    //     seeBirthdayOfUsers,
    //     eventUsersCounterAndAgeFull,
    //     seeUserSumOfPaymentsWithoutEvent,
    //     events,
    //     eventsUsers,
    //     users,
    //     directions,
    //     services,
    //     servicesUsers,
    //     productsUsers,
    //     additionalBlocks,
    //     editSiteSettings,
    //     setSelfStatus,
    //     setSelfRole,
    //     fabInCabinet,
    //   },
    //   (data) => {
    //     // setSiteSettings(data)
    //     setMessage('Данные обновлены успешно')
    //     // refreshPage()
    //   },
    //   () => {
    //     setMessage('')
    //     // addError({ response: 'Ошибка обновления данных' })
    //   },
    //   false,
    //   loggedUser._id
    // )
  }

  const buttonDisabled = !formChanged

  if (!role) return null

  return (
    <div className="flex flex-col flex-1 h-screen max-h-screen px-2 my-2 overflow-y-auto gap-y-2">
      <div className="flex items-center w-full p-1 gap-x-1">
        <div className="flex flex-row-reverse flex-1">
          {!buttonDisabled && (
            <span className="leading-4 text-right tablet:text-lg">
              Чтобы изменения вступили в силу нажмите:
            </span>
          )}
        </div>
        <Button
          name="Применить"
          disabled={!formChanged}
          onClick={onClickConfirm}
          // loading={isWaitingToResponse}
        />
      </div>
      {message && (
        <div className="flex flex-col col-span-2 text-success">{message}</div>
      )}
      <div className="">
        <FormWrapper>
          <Input label="Название роли" value={name} onChange={setName} />
          <CheckBox
            label="Видит полное ФИО пользователей"
            checked={seeFullUsersNames}
            onChange={() => setSeeFullUsersNames((state) => !state)}
          />
          <CheckBox
            label="Видит все контакты пользователей"
            checked={seeAllContactsOfUsers}
            onChange={() => setSeeAllContactsOfUsers((state) => !state)}
          />
          <CheckBox
            label="Видит дни рождения пользователей"
            checked={seeBirthdayOfUsers}
            onChange={() => setSeeBirthdayOfUsers((state) => !state)}
          />
          <CheckBox
            label="Расширенная сводка по участникам мероприятия на карточке мероприятия"
            checked={eventUsersCounterAndAgeFull}
            onChange={() => setEventUsersCounterAndAgeFull((state) => !state)}
          />
          <CheckBox
            label="Расширенный фильтр мероприятий"
            checked={eventStatusFilterFull}
            onChange={() => setEventStatusFilterFull((state) => !state)}
          />
          <CheckBox
            label="Видит незакрепленные транзакции пользователей"
            checked={seeUserSumOfPaymentsWithoutEvent}
            onChange={() =>
              setSeeUserSumOfPaymentsWithoutEvent((state) => !state)
            }
          />
        </FormWrapper>
      </div>
    </div>
  )
}

const SettingsRolesContent = (props) => {
  const [rolesSettings, setRolesSettings] = useRecoilState(rolesSettingsAtom)
  const [rolesTemp, setRolesTemp] = useState(rolesSettings ?? [])

  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0)

  const addItem = () => {
    setRolesTemp((state) => [...state, { _id: uuid(), ...DEFAULT_ROLE }])
    setSelectedRoleIndex(rolesTemp?.length ?? 0)
  }

  const deleteItem = (index) => {
    setRolesTemp((state) => state.filter((item) => index !== selectedRoleIndex))
    if (selectedRoleIndex > 0 && selectedRoleIndex > rolesTemp?.length - 1)
      setSelectedRoleIndex(selectedRoleIndex - 1)
  }

  const saveItem = (index, newItem) => {
    setRolesTemp((state) =>
      state.map((item, i) => (i === index ? newItem : item))
    )
  }

  return (
    <div className="flex flex-col flex-1 h-screen max-h-screen overflow-y-auto gap-y-2">
      {/* <FormWrapper>
  <div className="flex justify-center"> */}
      <FormWrapper className="flex flex-col gap-y-1">
        <div className="flex px-2 pt-1 gap-x-2">
          {rolesTemp?.length > 0 && (
            <ComboBox
              label="Роли"
              value={String(selectedRoleIndex)}
              onChange={(value) => setSelectedRoleIndex(Number(value))}
              items={rolesTemp.map(({ name, _id }, index) => ({
                name,
                value: index,
              }))}
              noMargin
              className="mt-1 min-w-48"
            />
          )}
          <div className="flex mt-2 gap-x-2">
            <Button
              name={!rolesTemp?.length ? 'Добавить роль' : undefined}
              icon={faPlus}
              onClick={addItem}
            />
            {rolesTemp?.length > 0 && (
              <Button
                // name="Удалить роль"
                icon={faTrash}
                onClick={deleteItem}
              />
            )}
          </div>
        </div>
        <Divider light thin />
        {typeof selectedRoleIndex === 'number' && (
          <RoleSettings
            key={'roleIndex' + selectedRoleIndex}
            role={rolesTemp[selectedRoleIndex]}
            saveRole={(updatedRole) => saveItem(selectedRoleIndex, updatedRole)}
          />
        )}
      </FormWrapper>
      {/* </div>
  </FormWrapper> */}
    </div>
  )
}

export default SettingsRolesContent
