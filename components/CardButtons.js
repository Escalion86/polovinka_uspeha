import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modalsFuncAtom } from '@state/atoms'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import {
  faCopy,
  faEye,
  faEyeSlash,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons'
import { putData } from '@helpers/CRUD'
import cn from 'classnames'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

const CardButton = ({ active, icon, onClick, color = 'red', dataTip }) => (
  <div
    className={cn(
      `duration-300 flex border items-center justify-center w-8 h-8 hover:bg-${color}-600 border-${color}-500 hover:border-${color}-600 hover:text-white`,
      active ? `bg-${color}-500 text-white` : `bg-white text-${color}-500`
    )}
    onClick={onClick}
    data-tip={dataTip}
  >
    <FontAwesomeIcon icon={icon} className="w-6 h-6" />
  </div>
)

const CardButtons = ({ item, typeOfItem }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const router = useRouter()

  const refreshPage = () => {
    router.replace(router.asPath)
  }

  return (
    <div className="flex h-8 overflow-hidden">
      <CardButton
        icon={faPencilAlt}
        onClick={(e) => {
          e.stopPropagation()
          modalsFunc[typeOfItem].edit(item)
        }}
        color="orange"
        dataTip="Редактировать"
      />
      {typeOfItem !== 'user' && typeOfItem !== 'review' && (
        <CardButton
          icon={faCopy}
          onClick={(e) => {
            e.stopPropagation()
            modalsFunc[typeOfItem].add(item)
          }}
          color="blue"
          dataTip="Клонировать"
        />
      )}
      {item.showOnSite !== undefined && (
        <CardButton
          active={!item.showOnSite}
          icon={item.showOnSite ? faEye : faEyeSlash}
          onClick={async (e) => {
            e.stopPropagation()
            await putData(
              `/api/${typeOfItem}s/${item._id}`,
              {
                showOnSite: !item.showOnSite,
              },
              refreshPage
            )
          }}
          color="purple"
          dataTip="Показывать на сайте"
        />
      )}
      <CardButton
        icon={faTrashAlt}
        onClick={(e) => {
          e.stopPropagation()
          modalsFunc[typeOfItem].delete(item)
        }}
        color="red"
        dataTip="Удалить"
      />
      {/* <div
  className={cn(
    'flex border items-center justify-center w-8 h-8 hover:bg-red-600 hover:text-white',
    direction.showOnSite
      ? 'bg-white border-red-500 text-red-500'
      : 'bg-red-500 text-white'
  )}
  onClick={async (e) => {
    e.stopPropagation()
    await putData(
      `/api/directions/${direction._id}`,
      {
        showOnSite: !direction.showOnSite,
      },
      refreshPage
    )
  }}
>
  <FontAwesomeIcon
    icon={direction.showOnSite ? faEye : faEyeSlash}
    className="w-6 h-6"
  />
</div> */}
    </div>
  )
}

export default CardButtons
