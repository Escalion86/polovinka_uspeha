import Button from '@components/Button'
import Divider from '@components/Divider'
import FormWrapper from '@components/FormWrapper'
import {
  faPencilAlt,
  faPlus,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import compareObjects from '@helpers/compareObjects'
import { useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import rolesAtom from '@state/atoms/rolesAtom'
import { DEFAULT_ROLES } from '@helpers/constants'
import CheckBox from '@components/CheckBox'
import { modalsFuncAtom } from '@state/atoms'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

const genRanHex = (size) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('')

const SubTitle = ({ name }) => (
  <div className="flex justify-center flex-1 px-2 font-bold bg-gray-200 border-t border-gray-400 text-md">
    {name}
  </div>
)

const SettingsRolesContent = (props) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const rolesSettings = useRecoilValue(rolesAtom)
  const [rolesTemp, setRolesTemp] = useState(rolesSettings)

  const updateRoles = useRecoilValue(itemsFuncAtom).roles.update

  const formChanged = !compareObjects(rolesSettings, rolesTemp)

  const toggleItem = (index, key, subKey) => {
    const temp = JSON.parse(JSON.stringify(rolesTemp))
    if (subKey) {
      if (typeof temp[index][key] !== 'object') {
        temp[index][key] = {}
        temp[index][key][subKey] = true
      } else {
        temp[index][key][subKey] = !temp[index][key][subKey]
      }
    } else {
      temp[index][key] = !temp[index][key]
    }
    setRolesTemp(temp)
  }

  const addRole = () => {
    const addRoleFunc = (name) => {
      setRolesTemp((state) => [
        ...state,
        { ...DEFAULT_ROLES[0], name, _id: genRanHex(24) },
      ])
    }
    modalsFunc.role.add(addRoleFunc)
  }

  const editRole = (role) => {
    const editRoleFunc = (name) => {
      setRolesTemp((state) =>
        state.map((roleOld) =>
          roleOld._id === role._id ? { ...roleOld, name } : roleOld
        )
      )
    }
    modalsFunc.role.edit(role, editRoleFunc)
  }

  const deleteRole = (id) => {
    setRolesTemp((state) => state.filter((role) => role._id !== id))
  }

  const onClickConfirm = () => {
    const preparedRoles = rolesTemp.filter(
      (role, index) => DEFAULT_ROLES.length <= index
    )
    updateRoles(preparedRoles)
  }

  const filteredRolesTemp = rolesTemp.filter((role) => role._id !== 'dev')

  const RoleItem = useCallback(
    ({ label, item, subItem }) => {
      return (
        <div className="flex items-center border-t border-gray-400 gap-x-1">
          <div className="flex-1 my-1 text-sm leading-3 text-center min-w-40 max-w-80">
            {label}
          </div>
          {filteredRolesTemp.map((role, index) => {
            const checked = subItem
              ? typeof role[item] === 'object'
                ? role[item][subItem]
                : false
              : typeof role[item] === 'boolean'
                ? role[item]
                : false

            return (
              <div
                key={item + role._id}
                className="flex justify-center flex-1 min-w-7 max-w-20"
              >
                <CheckBox
                  checked={checked}
                  onChange={() => toggleItem(index, item, subItem)}
                  noMargin
                  wrapperClassName="my-1"
                  disabled={DEFAULT_ROLES.length > index}
                />
              </div>
            )
          })}
        </div>
      )
    },
    [filteredRolesTemp]
  )

  return (
    <div className="flex flex-col flex-1 h-screen max-h-screen overflow-y-auto gap-y-2">
      <FormWrapper className="flex flex-col gap-y-1">
        <div className="flex px-2 pt-1 gap-x-2">
          <div className="flex justify-between w-full mt-2 gap-x-2">
            <Button name="Добавить роль" icon={faPlus} onClick={addRole} />
            <Button
              name="Применить"
              icon={faSave}
              onClick={onClickConfirm}
              disabled={!formChanged}
            />
          </div>
        </div>
        <Divider light thin />
        <FormWrapper>
          {/* <Input label="Название роли" value={name} onChange={setName} /> */}
          <div className="flex flex-col">
            <div className="flex items-end h-32 pb-2 gap-x-1">
              <div className="flex-1 text-sm leading-3 text-center min-w-40 max-w-80">
                {/* Пункт */}
              </div>
              {filteredRolesTemp.map((role, index) => (
                <div
                  key={'roleName' + role._id}
                  className="flex items-end justify-center flex-1 min-w-7 max-w-20"
                >
                  <div className="relative h-30 w-7">
                    {index >= DEFAULT_ROLES.length && (
                      <div className="absolute top-0 flex flex-col items-center justify-center w-full">
                        <FontAwesomeIcon
                          className="h-6 p-1 text-red-700 duration-300 cursor-pointer hover:scale-125"
                          icon={faTrash}
                          onClick={() => deleteRole(role._id)}
                        />
                        <FontAwesomeIcon
                          className="h-6 p-1 text-orange-500 duration-300 cursor-pointer hover:scale-125"
                          icon={faPencilAlt}
                          onClick={() => editRole(role)}
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-end flex-1 h-full">
                      <div className="origin-bottom-left -rotate-90 translate-x-[95%]">
                        {role.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <SubTitle name="Личное" />
            <RoleItem
              label='Видимость страницы "Мои достижения"'
              item="seeMyStatistics"
            />
            <RoleItem
              label="Изменение собственного статуса"
              item="setSelfStatus"
            />
            <RoleItem label="Изменение собственной роли" item="setSelfRole" />
            <RoleItem label='Скрыть кружок "?" справа внизу' item="hideFab" />
            {/*  */}
            <SubTitle name="Мероприятия" />
            <RoleItem label="Видит страницу" item="events" subItem="see" />
            <RoleItem label="Видит скрытые" item="events" subItem="seeHidden" />
            <RoleItem label="Добавление" item="events" subItem="add" />
            <RoleItem label="Редактирование" item="events" subItem="edit" />
            <RoleItem
              label="Изменение статуса"
              item="events"
              subItem="statusEdit"
            />
            <RoleItem
              label="Редактирование оплаты"
              item="events"
              subItem="paymentsEdit"
            />
            <RoleItem
              label="Показывать доход на карточке"
              item="events"
              subItem="showProfitOnCard"
            />
            <RoleItem label="Удаление" item="events" subItem="delete" />
            <RoleItem
              label="Расширенная сводка по участникам на карточке мероприятия"
              item="events"
              subItem="eventUsersCounterAndAgeFull"
            />
            <RoleItem
              label="Расширенный фильтр мероприятий"
              item="events"
              subItem="statusFilterFull"
            />
            <RoleItem
              label="Показывать кол-во в резерве на карте"
              item="events"
              subItem="seeReserveOnCard"
            />
            <RoleItem
              label="Просмотр истории изменений"
              item="events"
              subItem="seeHistory"
            />
            <RoleItem
              label="Редактирование лайков"
              item="events"
              subItem="editLikes"
            />
            <SubTitle name="Список участников мероприятия" />
            <RoleItem label="Видит список" item="eventsUsers" subItem="see" />
            <RoleItem
              label="Редактирование"
              item="eventsUsers"
              subItem="edit"
            />
            <RoleItem
              label="Копирование списка в буфер"
              item="eventsUsers"
              subItem="copyListToClipboard"
            />
            {/*  */}
            <SubTitle name="Пользователи" />
            <RoleItem label="Видит страницу" item="users" subItem="see" />
            <RoleItem
              label="Видит только клубных"
              item="users"
              subItem="seeMembersOnly"
            />
            <RoleItem
              label="Видит полное ФИО"
              item="users"
              subItem="seeFullNames"
            />
            <RoleItem
              label="Видит все контакты"
              item="users"
              subItem="seeAllContacts"
            />
            <RoleItem
              label="Видит дни рождения"
              item="users"
              subItem="seeBirthday"
            />
            <RoleItem
              label="Список мероприятий с участием"
              item="users"
              subItem="seeUserEvents"
            />
            <RoleItem
              label="Список транзакций пользователя"
              item="users"
              subItem="seeUserPayments"
            />
            <RoleItem
              label="Показывать сумму незакрепленных оплат на карточке"
              item="users"
              subItem="seeSumOfPaymentsWithoutEventOnCard"
            />
            <RoleItem label="Добавление" item="users" subItem="add" />
            <RoleItem label="Редактирование" item="users" subItem="edit" />
            <RoleItem
              label="Изменение статуса"
              item="users"
              subItem="setStatus"
            />
            <RoleItem label="Изменение роли" item="users" subItem="setRole" />
            <RoleItem
              label="Изменение пароля"
              item="users"
              subItem="setPassword"
            />
            <RoleItem label="Удаление" item="users" subItem="delete" />
            <RoleItem
              label="Просмотр истории изменений"
              item="users"
              subItem="seeHistory"
            />
            <RoleItem
              label="Просмотр истории действий пользователя"
              item="users"
              subItem="seeActionsHistory"
            />
            <SubTitle name="Услуги" />
            <RoleItem label="Видит страницу" item="services" subItem="see" />
            <RoleItem
              label="Видит скрытые"
              item="services"
              subItem="seeHidden"
            />
            <RoleItem label="Добавление" item="services" subItem="add" />
            <RoleItem label="Редактирование" item="services" subItem="edit" />
            <RoleItem label="Удаление" item="services" subItem="delete" />
            <RoleItem
              label="Просмотр истории изменений"
              item="services"
              subItem="seeHistory"
            />
            <SubTitle name="Заявки на услуги" />
            <RoleItem
              label="Видит страницу"
              item="servicesUsers"
              subItem="see"
            />
            <RoleItem label="Добавление" item="servicesUsers" subItem="add" />
            <RoleItem
              label="Редактирование"
              item="servicesUsers"
              subItem="edit"
            />
            <RoleItem
              label="Изменение статуса"
              item="servicesUsers"
              subItem="statusEdit"
            />
            <RoleItem label="Удаление" item="servicesUsers" subItem="delete" />
            <SubTitle name="Продукты / Товары" />
            <RoleItem label="Видит страницу" item="products" subItem="see" />
            <RoleItem
              label="Видит скрытые"
              item="products"
              subItem="seeHidden"
            />
            <RoleItem label="Добавление" item="products" subItem="add" />
            <RoleItem label="Редактирование" item="products" subItem="edit" />
            <RoleItem label="Удаление" item="products" subItem="delete" />
            <RoleItem
              label="Просмотр истории изменений"
              item="products"
              subItem="seeHistory"
            />

            <SubTitle name="Заявки на продукты" />
            <RoleItem
              label="Видит страницу"
              item="productsUsers"
              subItem="see"
            />
            <RoleItem label="Добавление" item="productsUsers" subItem="add" />
            <RoleItem
              label="Редактирование"
              item="productsUsers"
              subItem="edit"
            />
            <RoleItem
              label="Изменение статуса"
              item="productsUsers"
              subItem="statusEdit"
            />
            <RoleItem label="Удаление" item="productsUsers" subItem="delete" />
            <SubTitle name="Финансы" />
            <RoleItem label="Видит страницу" item="payments" subItem="see" />
            <RoleItem label="Добавление" item="payments" subItem="add" />
            <RoleItem label="Редактирование" item="payments" subItem="edit" />
            <RoleItem label="Удаление" item="payments" subItem="delete" />
            <RoleItem
              label="Страница - Незакрепленные транзакции пользователей"
              item="payments"
              subItem="paymentsWithNoEvent"
            />
            <RoleItem
              label="Страница - Непривязанные транзакции"
              item="payments"
              subItem="paymentsNotParticipantsEvent"
            />
            <RoleItem
              label="Просмотр истории изменений транзакций"
              item="payments"
              subItem="seeHistory"
            />
            <SubTitle name="Статистика" />
            <RoleItem label="Мероприятия" item="statistics" subItem="events" />
            <RoleItem label="Пользователи" item="statistics" subItem="users" />
            <RoleItem label="Финансы" item="statistics" subItem="finances" />
            <SubTitle name="Настройки сайта" />
            <RoleItem
              label="Настройки сервиса подтверждения номера"
              item="siteSettings"
              subItem="phoneConfirmService"
            />
            <RoleItem
              label='Настройки меню "?"'
              item="siteSettings"
              subItem="fabMenu"
            />
            <RoleItem
              label="Редактирование ролей"
              item="siteSettings"
              subItem="roles"
            />
            <RoleItem
              label="Настройки даты старта проекта"
              item="siteSettings"
              subItem="dateStartProject"
            />
            <RoleItem
              label="Информации для вступления в клуб"
              item="siteSettings"
              subItem="headerInfo"
            />
            <SubTitle name="Уведомления" />
            <RoleItem
              label="Новые мероприятия (по тэгам)"
              item="notifications"
              subItem="newEventsByTags"
            />
            <RoleItem
              label="Дни рождения пользователей"
              item="notifications"
              subItem="birthdays"
            />
            <RoleItem
              label="Регистрация новых пользователей на сайте"
              item="notifications"
              subItem="newUserRegistred"
            />
            <RoleItem
              label="Регистрации на мероприятия"
              item="notifications"
              subItem="eventRegistration"
            />
            <RoleItem
              label="Новые заявки на услуги"
              item="notifications"
              subItem="serviceRegistration"
            />
            <SubTitle name="Главная страница сайта" />
            <RoleItem
              label="Редактирование направлений"
              item="generalPage"
              subItem="directions"
            />
            <RoleItem
              label="Редактирование доп. блоков"
              item="generalPage"
              subItem="additionalBlocks"
            />
            <RoleItem
              label="Редактирование отзывов"
              item="generalPage"
              subItem="reviews"
            />
            <RoleItem
              label="Редактирование контактов"
              item="generalPage"
              subItem="contacts"
            />
            <RoleItem
              label="Редактирование блока руководителя региона"
              item="generalPage"
              subItem="supervisor"
            />
            <SubTitle name="Инструменты" />
            <RoleItem
              label="Генератор текста анонса мероприятий"
              item="instruments"
              subItem="anonsTextGenerator"
            />
            <RoleItem
              label="Редактор анонса мероприятия"
              item="instruments"
              subItem="anonsEventImageGenerator"
            />
            <RoleItem
              label="Редактор анонса списка мероприятий"
              item="instruments"
              subItem="anonsEventListImageGenerator"
            />
            <RoleItem
              label="Экспорт данных"
              item="instruments"
              subItem="export"
            />
            <RoleItem
              label="Конструктор картинок"
              item="instruments"
              subItem="imageConstructor"
            />
            <RoleItem
              label="Рассылки"
              item="instruments"
              subItem="newsletter"
            />
            <SubTitle name="События" />
            <RoleItem
              label="Записи на мероприятия"
              item="notices"
              subItem="histories"
            />
            <RoleItem label="Дни рождения" item="notices" subItem="birthdays" />
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
