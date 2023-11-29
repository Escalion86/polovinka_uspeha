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
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { v4 as uuid } from 'uuid'
// import cn from 'classnames'
// import TelegramIcon from 'svg/TelegramIcon'
import rolesSettingsAtom from '@state/atoms/rolesSettingsAtom'
import ComboBox from '@components/ComboBox'
import { DEFAULT_ROLES } from '@helpers/constants'
import CheckBox from '@components/CheckBox'
import { modalsFuncAtom } from '@state/atoms'

const SettingsRolesContent = (props) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [rolesSettings, setRolesSettings] = useRecoilState(rolesSettingsAtom)
  const [rolesTemp, setRolesTemp] = useState(rolesSettings)
  console.log('rolesTemp :>> ', rolesTemp)
  // const [selectedRoleIndex, setSelectedRoleIndex] = useState(0)

  // const addItem = () => {
  //   setRolesTemp((state) => [...state, { _id: uuid(), ...DEFAULT_ROLE }])
  //   setSelectedRoleIndex(rolesTemp?.length ?? 0)
  // }

  // const deleteItem = (index) => {
  //   setRolesTemp((state) => state.filter((item) => index !== selectedRoleIndex))
  //   if (selectedRoleIndex > 0 && selectedRoleIndex > rolesTemp?.length - 1)
  //     setSelectedRoleIndex(selectedRoleIndex - 1)
  // }

  // const saveItem = (index, newItem) => {
  //   setRolesTemp((state) =>
  //     state.map((item, i) => (i === index ? newItem : item))
  //   )
  // }

  const toggleItem = (index, key) => {
    const temp = JSON.parse(JSON.stringify(rolesTemp))
    temp[index][key] = !temp[index][key]
    setRolesTemp(temp)
  }

  const addRole = () => {
    const addRoleFunc = (name) => {
      setRolesTemp((state) => [...state, { name, id: uuid() }])
    }
    modalsFunc.role.add(addRoleFunc)
  }

  const RoleItem = useCallback(
    ({ label, item }) => {
      return (
        <div className="flex items-center border-t border-gray-400 gap-x-1">
          <div className="flex-1 my-1 text-sm leading-3 text-center min-w-40 max-w-80">
            {label}
          </div>
          {rolesTemp.map((role, index) => (
            <div
              key={item + index}
              className="flex justify-center flex-1 min-w-7 max-w-20"
            >
              <CheckBox
                checked={role[item]}
                onChange={() => toggleItem(index, item)}
                noMargin
                wrapperClassName="my-1"
              />
            </div>
          ))}
        </div>
      )
    },
    [rolesTemp]
  )

  return (
    <div className="flex flex-col flex-1 h-screen max-h-screen overflow-y-auto gap-y-2">
      {/* <FormWrapper>
  <div className="flex justify-center"> */}
      <FormWrapper className="flex flex-col gap-y-1">
        <div className="flex px-2 pt-1 gap-x-2">
          {/* {rolesTemp?.length > 0 && (
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
          )} */}
          <div className="flex mt-2 gap-x-2">
            <Button name="Добавить роль" icon={faPlus} onClick={addRole} />
            {/* {rolesTemp?.length > 0 && (
              <Button
                // name="Удалить роль"
                icon={faTrash}
                onClick={deleteItem}
              />
            )} */}
          </div>
        </div>
        <Divider light thin />
        {/* {typeof selectedRoleIndex === 'number' && (
          <RoleSettings
            key={'roleIndex' + selectedRoleIndex}
            role={rolesTemp[selectedRoleIndex]}
            saveRole={(updatedRole) => saveItem(selectedRoleIndex, updatedRole)}
          />
        )} */}
        <FormWrapper>
          {/* <Input label="Название роли" value={name} onChange={setName} /> */}
          <div className="flex flex-col">
            <div className="flex items-end pb-2 h-28 gap-x-1">
              <div className="flex-1 text-sm leading-3 text-center min-w-40 max-w-80">
                {/* Пункт */}
              </div>
              {rolesTemp.map(({ name }, index) => (
                <div
                  key={'roleName' + index}
                  className="flex items-end justify-center flex-1 min-w-7 max-w-20"
                >
                  <div className="w-7">
                    <div className="origin-bottom-left -rotate-90 translate-x-[95%]">
                      {name}
                    </div>
                  </div>
                </div>
              ))}
              {/* <div className="flex items-end justify-center flex-1 min-w-7 max-w-20">
                <div className="w-7">
                  <div className="-rotate-90">Роль1</div>
                </div>
              </div>
              <div className="flex items-end justify-center flex-1 min-w-7 max-w-20">
                <div className="w-7">
                  <div className="-rotate-90">Роль2</div>
                </div>
              </div>
              <div className="flex items-end justify-center flex-1 min-w-7 max-w-20">
                <div className="w-7">
                  <div className="origin-bottom-left -rotate-90 translate-x-full">
                    Роль3ghdgd
                  </div>
                </div>
              </div> */}
            </div>
            <div className="flex justify-center flex-1 px-2 font-bold bg-gray-200 border-t border-gray-400 text-md">
              Личное
            </div>
            <RoleItem
              label="Изменение собственного статуса"
              item="setSelfStatus"
            />
            <RoleItem label="Изменение собственной роли" item="setSelfRole" />
            <RoleItem
              label='Скрыть кружок "?" справа внизу'
              item="fabInCabinet"
            />
            <div className="flex justify-center flex-1 px-2 font-bold bg-gray-200 border-t border-gray-400 text-md">
              Пользователи
            </div>
            <RoleItem
              label="Видит полное ФИО пользователей"
              item="seeFullUsersNames"
            />
            <RoleItem
              label="Видит все контакты пользователей"
              item="seeAllContactsOfUsers"
            />
            <RoleItem
              label="Видит дни рождения пользователей"
              item="seeBirthdayOfUsers"
            />
            <div className="flex justify-center flex-1 px-2 font-bold bg-gray-200 border-t border-gray-400 text-md">
              Мероприятия
            </div>
            <RoleItem
              label="Расширенная сводка по участникам на карточке мероприятия"
              item="eventUsersCounterAndAgeFull"
            />
            <RoleItem
              label="Расширенный фильтр мероприятий"
              item="eventStatusFilterFull"
            />

            <div className="flex justify-center flex-1 px-2 font-bold bg-gray-200 border-t border-gray-400 text-md">
              Финансы
            </div>
            <RoleItem
              label="Видит незакрепленные транзакции пользователей"
              item="seeUserSumOfPaymentsWithoutEvent"
            />
            <div className="flex justify-center flex-1 px-2 font-bold bg-gray-200 border-t border-gray-400 text-md">
              Настройки сайта
            </div>
            <RoleItem
              label="Настройки сервиса подтверждения номера"
              item="editPhoneConfirmService"
            />
            <RoleItem label='Настройки меню "?"' item="editFabMenu" />
            <RoleItem label="Редактирование ролей" item="editRoles" />

            {/* // seeAllContactsOfUsers,
      // notifications,
      // events,
      // eventsUsers,
      // users,
      // directions,
      // services,
      // servicesUsers,
      // productsUsers,
      // additionalBlocks, */}
            {/* editPhoneConfirmService,
      editFabMenu,
      editRoles */}
          </div>
        </FormWrapper>
      </FormWrapper>
      {/* </div>
  </FormWrapper> */}
    </div>
  )
}

export default SettingsRolesContent
