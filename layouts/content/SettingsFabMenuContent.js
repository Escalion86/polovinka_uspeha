import Button from '@components/Button'
import Divider from '@components/Divider'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import PhoneInput from '@components/PhoneInput'
import {
  faArrowDown,
  faArrowUp,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { postData } from '@helpers/CRUD'
import arrayMove from '@helpers/arrayMove'
import compareObjects from '@helpers/compareObjects'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { uid } from 'uid'

const ItemMenu = ({
  item,
  onChange,
  index,
  onDelete,
  onClickUp,
  onClickDown,
}) => {
  return (
    <FormWrapper className="flex pb-1 border-t border-gray-400 gap-x-1">
      <div className="flex-1">
        <Input
          label="Название пункта"
          value={item.text}
          onChange={(newValue) => onChange({ key: item.key, text: newValue })}
          // noMargin
        />
        <div className="flex flex-wrap gap-x-2">
          <PhoneInput
            label="Номер Whatsapp"
            value={item.whatsapp ?? ''}
            onChange={(newValue) =>
              onChange({ key: item.key, whatsapp: newValue })
            }
          />
          <Input
            prefix="@"
            label="Имя в Telegram"
            value={item.telegram ?? ''}
            onChange={(newValue) =>
              onChange({ key: item.key, telegram: newValue })
            }
          />
        </div>
      </div>
      <div className="flex flex-col items-center pt-4 gap-y-2">
        <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
          <FontAwesomeIcon
            className="w-5 h-5 text-danger"
            icon={faTrash}
            size="1x"
            onClick={() => onDelete(item.key)}
          />
        </div>
        {onClickUp && (
          <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
            <FontAwesomeIcon
              className="w-5 h-5 text-disabled"
              icon={faArrowUp}
              size="1x"
              onClick={() => onClickUp(index)}
            />
          </div>
        )}
        {onClickDown && (
          <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
            <FontAwesomeIcon
              className="w-5 h-5 text-disabled"
              icon={faArrowDown}
              size="1x"
              onClick={() => onClickDown(index)}
            />
          </div>
        )}
      </div>
    </FormWrapper>
  )
}

const SettingsFabMenuContent = (props) => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const [siteSettings, setSiteSettings] = useRecoilState(siteSettingsAtom)
  const [fabMenu, setFabMenu] = useState(siteSettings?.fabMenu ?? [])

  const [message, setMessage] = useState('')

  const formChanged = !compareObjects(siteSettings?.fabMenu, fabMenu)

  const onClickConfirm = async () => {
    await postData(
      `/api/site`,
      {
        fabMenu,
      },
      (data) => {
        setSiteSettings(data)
        setMessage('Данные обновлены успешно')
        // refreshPage()
      },
      () => {
        setMessage('')
        // addError({ response: 'Ошибка обновления данных' })
      },
      false,
      loggedUser._id
    )
  }

  const buttonDisabled = !formChanged

  const addItem = () => {
    // var params = {}
    // var defaultValue = null
    // if (type === 'whatsapp') {
    //   params = { minItems: 1, maxItems: 10, withNumbering: false }
    //   defaultValue = []
    // }
    // if (type === 'telegram' || type === 'images') {
    //   defaultValue = []
    // }
    setFabMenu((state) => [
      ...state,
      {
        key: uid(24),
        text: '',
        telegram: '',
        whatsapp: '',
      },
    ])
  }

  const onClickUp = (index) => {
    setFabMenu((state) => arrayMove(state, index, index - 1))
  }

  const onClickDown = (index) => {
    setFabMenu((state) => arrayMove(state, index, index + 1))
  }

  const deleteItem = (key) => {
    setFabMenu((state) => state.filter((item) => item.key !== key))
  }

  const onChangeItem = (obj) => {
    setFabMenu((state) =>
      state.map((item) => (item.key === obj.key ? { ...item, ...obj } : item))
    )
  }

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
      {/* <FormWrapper>
      <div className="flex justify-center"> */}
      <FormWrapper className="flex flex-col gap-y-1">
        {fabMenu?.length > 0 ? (
          fabMenu.map((item, index) => (
            <ItemMenu
              key={item.key}
              item={item}
              onChange={onChangeItem}
              index={index}
              onDelete={deleteItem}
              onClickUp={index > 0 && onClickUp}
              onClickDown={index < fabMenu.length - 1 && onClickDown}
            />
          ))
        ) : (
          <div>
            Пункты меню отсутствуют. Нажмите "Добавить", для добавления пунктов
            меню
          </div>
        )}
        <Divider light thin />
        <Button name="Добавить" icon={faPlus} onClick={addItem} />
        {/* <IconButtonMenu
          // dense
          name="Добавить"
          icon={faPlus}
          items={[
            {
              icon: faWhatsapp,
              name: 'WhatsApp',
              value: 'whatsapp',
              iconClassNameColor: 'text-green-700',
            },
            {
              icon: faTelegram,
              name: 'Telegram',
              value: 'telegram',
              iconClassNameColor: 'text-blue-500',
            },
          ]}
          onChange={addItem}
        /> */}
      </FormWrapper>
      {/* </div>
      </FormWrapper> */}
    </div>
  )
}

export default SettingsFabMenuContent
